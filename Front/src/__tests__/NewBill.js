/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../pages/NewBill/NewBillUI.js"
import { initNewBillPage, handleChangeFile, handleSubmit, resetBillFileState } from "../pages/NewBill/NewBill.js"
import { ROUTES_PATH } from "../constants/routes.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then the form should be rendered with all required fields", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      expect(screen.getByTestId("form-new-bill")).toBeTruthy()
      expect(screen.getByTestId("expense-type")).toBeTruthy()
      expect(screen.getByTestId("expense-name")).toBeTruthy()
      expect(screen.getByTestId("datepicker")).toBeTruthy()
      expect(screen.getByTestId("amount")).toBeTruthy()
      expect(screen.getByTestId("vat")).toBeTruthy()
      expect(screen.getByTestId("pct")).toBeTruthy()
      expect(screen.getByTestId("commentary")).toBeTruthy()
      expect(screen.getByTestId("file")).toBeTruthy()
    })

    test("Then the submit button should be rendered", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const submitButton = screen.getByText("Envoyer")

      expect(submitButton).toBeTruthy()
      expect(submitButton.type).toBe("submit")
    })

    test("Then the page title should be displayed", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy()
    })

    test("Then the expense type select should have all options", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const expenseTypeSelect = screen.getByTestId("expense-type")

      expect(expenseTypeSelect).toBeTruthy()
      expect(screen.getByText("Transports")).toBeTruthy()
      expect(screen.getByText("Restaurants et bars")).toBeTruthy()
      expect(screen.getByText("Hôtel et logement")).toBeTruthy()
      expect(screen.getByText("Services en ligne")).toBeTruthy()
      expect(screen.getByText("IT et électronique")).toBeTruthy()
      expect(screen.getByText("Equipement et matériel")).toBeTruthy()
      expect(screen.getByText("Fournitures de bureau")).toBeTruthy()
    })
  })

  describe("Lorsque la fonction initNewBillPage est appelée", () => {
    test("Alors la page doit être correctement initialisée", () => {
      document.body.innerHTML = NewBillUI()

      const onNavigate = jest.fn()

      const store = {
        bills: jest.fn()
      }

      const localStorage = {
        getItem: jest.fn()
      }

      expect(() => {
        initNewBillPage({document,onNavigate,store,localStorage})
      }).not.toThrow()

      const formulaireNouvelleNote = document.querySelector(
        'form[data-testid="form-new-bill"]'
      )

      const champFichier = document.querySelector(
        'input[data-testid="file"]'
      )

      expect(formulaireNouvelleNote).toBeTruthy()
      expect(champFichier).toBeTruthy()
    })
  })


describe("Lorsque handleChangeFile est appelée", () => {
  beforeEach(() => {
    resetBillFileState()
    document.body.innerHTML = NewBillUI()
  })

  test(
    "Alors un fichier image valide est uploadé dans le store",
    async () => {
      const fileInput = document.querySelector(
        `input[data-testid="file"]`
      )

      const mockFile = new File(
        ["image"],
        "test-image.jpg",
        { type: "image/jpeg" }
      )

      Object.defineProperty(fileInput, "files", {
        value: [mockFile],
        configurable: true
      })

      const localStorage = {
        getItem: jest.fn(() =>
          JSON.stringify({ email: "test@mock.com" })
        )
      }

      const create = jest.fn(() =>
        Promise.resolve({
          fileUrl: "https://example.com/test-image.jpg",
          key: "12345"
        })
      )

      const store = {
        bills: jest.fn(() => ({
          create
        }))
      }

      const e = {
        preventDefault: jest.fn(),
        target: {
          value: "C:\\fakepath\\test-image.jpg"
        }
      }

      expect(fileInput.files[0].name).toBe("test-image.jpg")
      expect(fileInput.files[0].type).toBe("image/jpeg")
      expect(fileInput.files[0]).toBeInstanceOf(File)

      await handleChangeFile(e, { store, localStorage })

      expect(e.preventDefault).toHaveBeenCalled()
      expect(localStorage.getItem).toHaveBeenCalledWith("user")
      expect(store.bills).toHaveBeenCalledTimes(1)
      expect(create).toHaveBeenCalledTimes(1)

      expect(create).toHaveBeenCalledWith({
        data: expect.any(FormData),
        headers: {
          noContentType: true
        }
      })
    }
  )

  test(
    "Alors un fichier non image est refusé et n'est pas uploadé",
    () => {
      const fileInput = document.querySelector(
        `input[data-testid="file"]`
      )

      const mockFile = new File(
        ["document"],
        "test-document.pdf",
        { type: "application/pdf" }
      )

      Object.defineProperty(fileInput, "files", {
        value: [mockFile],
        configurable: true
      })

      const localStorage = {
        getItem: jest.fn(() =>
          JSON.stringify({ email: "test@mock.com" })
        )
      }

      const create = jest.fn()

      const store = {
        bills: jest.fn(() => ({
          create
        }))
      }

      const alertSpy = jest
        .spyOn(window, "alert")
        .mockImplementation(() => {})

      const e = {
        preventDefault: jest.fn(),
        target: {
          value: "C:\\fakepath\\test-document.pdf"
        }
      }

      expect(fileInput.files[0].name).toBe("test-document.pdf")
      expect(fileInput.files[0].type).toBe("application/pdf")
      expect(fileInput.files[0]).toBeInstanceOf(File)

      handleChangeFile(e, { store, localStorage })

      expect(e.preventDefault).toHaveBeenCalled()
      expect(alertSpy).toHaveBeenCalledWith(
        "Veuillez sélectionner un fichier au format JPG, JPEG ou PNG."
      )
      expect(create).not.toHaveBeenCalled()

      alertSpy.mockRestore()
    }
  )
})
})