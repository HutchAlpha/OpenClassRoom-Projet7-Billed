/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import BillsUI from "../pages/Bills/BillsUI.js"
import { initBillsPage, getBills} from "../pages/Bills/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      
      //! Correction du test pour vérifier si l'icône est active
      expect(windowIcon.classList.contains("active-icon")).toBe(true)
      
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

      test("clic sur le bouton « Nouvelle note de frais »", () => {
        document.body.innerHTML = BillsUI({ data: bills })
        
        // Mock de la fonction onNavigate
        const onNavigate = jest.fn()

        initBillsPage({document,onNavigate,store: {},localStorage: localStorageMock,})

        const buttonNewBill = document.querySelector('button[data-testid="btn-new-bill"]')

        buttonNewBill.click()

        expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH.NewBill)
    })

    test("clic sur une icône œil : ouvre le justificatif", () => {
      document.body.innerHTML = BillsUI({ data: bills })

      const iconEye = document.querySelector('div[data-testid="icon-eye"]')
      expect(iconEye).not.toBeNull()

      const billUrl = iconEye.getAttribute("data-bill-url")
      const modaleFile = document.querySelector("#modaleFile")
      expect(modaleFile).not.toBeNull()

      const show = jest.fn(() => {
        modaleFile.dispatchEvent(new Event("shown.bs.modal"))
      })

      global.bootstrap = {
        Modal: jest.fn(() => ({ show })),
      }

      initBillsPage({document,onNavigate: jest.fn(),store: {},localStorage: localStorageMock,})

      iconEye.click()

      expect(global.bootstrap.Modal).toHaveBeenCalledWith(modaleFile)
      expect(show).toHaveBeenCalled()
      expect(modaleFile.querySelector(".modal-body img").getAttribute("src"))
        .toBe(billUrl)
    })

    test("récupère les bills depuis le store", async () => {
      const mockStore = {
        bills: jest.fn(() => ({
          list: jest.fn(() => Promise.resolve(bills)),
        })),
      }

      expect(await getBills(mockStore)).toEqual(bills)
    })
  })
})
