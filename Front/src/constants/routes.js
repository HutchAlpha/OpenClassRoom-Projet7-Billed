import LoginUI from "../pages/Login/LoginUI.js"
import BillsUI from "../pages/Bills/BillsUI.js"
import NewBillUI from "../pages/NewBill/NewBillUI.js"
import DashboardUI from "../pages/Dashboard/DashboardUI.js"
import ErrorPage from "../components/ErrorPage.js"

export const ROUTES_PATH = {
  Login: '/',
  Bills: '#employee/bills',
  NewBill: '#employee/bill/new',
  Dashboard: '#admin/dashboard',
  Erreur404: '#error/404',
  Erreur500: '#error/500'
}

export const ROUTES = ({ pathname, data, error, loading }) => {
  switch (pathname) {
    case ROUTES_PATH['Login']:
      return LoginUI({ data, error, loading })

    case ROUTES_PATH['Bills']:
      return BillsUI({ data, error, loading })

    case ROUTES_PATH['NewBill']:
      return NewBillUI()

    case ROUTES_PATH['Dashboard']:
      return DashboardUI({ data, error, loading })

    case ROUTES_PATH['Erreur404']:
      return ErrorPage('Erreur 404')

    case ROUTES_PATH['Erreur500']:
      return ErrorPage('Erreur 500')

    default:
      return LoginUI({ data, error, loading })
  }
}

