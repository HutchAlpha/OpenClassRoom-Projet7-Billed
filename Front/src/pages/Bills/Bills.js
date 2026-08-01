import { ROUTES_PATH } from '../../constants/routes.js'
import { formatDate, formatStatus } from "../../app/format.js"
import Logout from "../../components/Logout.js"

/**
 * Initialise la page Bills - Attache les event listeners
 */
export const initBillsPage = ({ document, onNavigate, store, localStorage }) => {
  // Bouton "Nouvelle note de frais"
  const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
  if (buttonNewBill) {
    buttonNewBill.addEventListener('click', () => {
      onNavigate(ROUTES_PATH['NewBill'])
    })
  }

  // Icônes "oeil" pour voir les justificatifs
  const iconEyes = document.querySelectorAll(`div[data-testid="icon-eye"]`)
  if (iconEyes) {
    iconEyes.forEach(icon => {
      icon.addEventListener('click', () => {
        handleClickIconEye(icon, document)
      })
    })
  }

  // Initialise le bouton de déconnexion
  new Logout({ document, localStorage, onNavigate })
}

/**
 * Gère le clic sur l'icône oeil - Ouvre la modale avec l'image
 */
const handleClickIconEye = (icon, document) => {
  const billUrl = icon.getAttribute("data-bill-url")
  const modaleFile = document.querySelector('#modaleFile')
  const modal = new bootstrap.Modal(modaleFile)

  modaleFile.addEventListener('shown.bs.modal', () => {
    const modalBody = modaleFile.querySelector(".modal-body")
    modalBody.innerHTML =
      `<div style="text-align: center;" class="bill-proof-container">
        <img src="${billUrl}" alt="Bill"
          style="max-width: 100%; max-height: 80vh; height: auto; object-fit: contain;" />
      </div>`
  }, { once: true })

  modal.show()
}

/**
 * Récupère les bills depuis le store
 */
export const getBills = async (store) => {
  if (!store) return []

  try {
    const snapshot = await store.bills().list()

    const bills = snapshot.map(doc => {
      try {
        return {
          ...doc,
          date: formatDate(doc.date),
          status: formatStatus(doc.status)
        }
      } catch (e) {
        // Si les données sont corrompues, on garde la date non formatée
        console.log(e, 'for', doc)
        return {
          ...doc,
          date: doc.date,
          status: formatStatus(doc.status)
        }
      }
    })

    console.log('length', bills.length)
    return bills
  } catch (error) {
    console.error('Error fetching bills:', error)
    throw error
  }
}
