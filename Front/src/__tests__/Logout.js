/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import Logout from "../components/Logout.js"
import '@testing-library/jest-dom/extend-expect'
import { localStorageMock } from "../__mocks__/localStorage.js"
import DashboardUI from "../pages/Dashboard/DashboardUI.js"
import userEvent from '@testing-library/user-event'
import { ROUTES } from "../constants/routes"

const bills = [{
  "id": "47qAXb6fIm2zOKkLzMro",
  "vat": "80",
  "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
  "status": "pending",
  "type": "Hôtel et logement",
  "commentary": "séminaire billed",
  "name": "encore",
  "fileName": "preview-facture-free-201801-pdf-1.jpg",
  "date": "2004-04-04",
  "amount": 400,
  "commentAdmin": "ok",
  "email": "a@a",
  "pct": 20,
}]

describe('Given I am connected', () => {
  describe('When I click on disconnect button', () => {
    test(('Then, I should be sent to login page'), () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      document.body.innerHTML = DashboardUI({ bills })
      const logout = new Logout({ document, onNavigate, localStorage })
      const handleClick = jest.fn(logout.handleClick)

      const disco = screen.getByTestId('layout-disconnect')
      disco.addEventListener('click', handleClick)
      userEvent.click(disco)
      expect(handleClick).toHaveBeenCalled()
      expect(screen.getByText('Administration')).toBeTruthy()
    })
  })

  test("ne plante pas si le bouton de déconnexion est absent", () => {
    document.body.innerHTML = ''

    const onNavigate = jest.fn()
    const localStorageMock = { clear: jest.fn() }

    expect(() => {
      new Logout({
        document,
        onNavigate,
        localStorage: localStorageMock,
      })
    }).not.toThrow() //! s’exécute sans lancer d’erreur

    expect(localStorageMock.clear).not.toHaveBeenCalled()
    expect(onNavigate).not.toHaveBeenCalled()
  })
})
