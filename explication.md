#### EXPLICATIONS DES CORRECTIFS ####

Changement a faire : 

- Pour Admin, ajouter ordre des dates
- Ajouter des tests unitaires

# Problème connexion Admin

- Login.js

## Avant
```js
  const user = {
    type: "Admin",
    email: e.target.querySelector(`input[data-testid="  //employee//  -email-input"]`).value,
    password: e.target.querySelector(`input[data-testid="  //employee//  -password-input"]`).value,
    status: "connected"
  }
```
##  Après
```js
  const user = {
    type: "Admin",
    email: e.target.querySelector(`input[data-testid="admin-email-input"]`).value,
    password: e.target.querySelector(`input[data-testid="admin-password-input"]`).value,
    status: "connected"
  }
```

### Explication du problème
Emplyee a été mis au lieu de user donc type été a null a cause de cela



# Images trop grande par rapport a l'affichages (Employee)

- Bills.js

## Avant
```js
/**
 * Gère le clic sur l'icône oeil - Ouvre la modale avec l'image
 */
const handleClickIconEye = (icon, document) => {
  const billUrl = icon.getAttribute("data-bill-url")
  const modaleFile = document.querySelector('#modaleFile')
  const modal = new bootstrap.Modal(modaleFile)

  // Attendre que la modale soit visible pour calculer la largeur
  modaleFile.addEventListener('shown.bs.modal', () => {
    const imgWidth = Math.floor(modaleFile.getBoundingClientRect().width * 0.5)
    modaleFile.querySelector(".modal-body").innerHTML =
      `<div style='text-align: center;' class="bill-proof-container">
        <img width=${imgWidth} src=${billUrl} alt="Bill" />
      </div>`
  }, { once: true })

  modal.show()
}
```

## Après
```js
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
```
### Explication du problème

Le code original calculait la largeur de l'image avec :

```js
const imgWidth = Math.floor(modaleFile.getBoundingClientRect().width * 0.5)
```

Le problème : `#modaleFile` est l'élément `.modal` de Bootstrap, c'est-à-dire l'**overlay plein écran** qui recouvre tout le viewport. `getBoundingClientRect().width` retourne donc la **largeur totale de l'écran**, et non celle du conteneur réel de la modale (`.modal-dialog.modal-lg`

En multipliant par 0.5, on obtenait 50% de la largeur de l'écran, ce qui pouvait dépasser la largeur réelle du `.modal-dialog`.



# Images trop grande par rapport a l'affichages (Admin)

- Dashboard.js

## Avant

```js
export const handleClickIconEye = (document) => {
  const billUrl = document.querySelector('#icon-eye-d').getAttribute("data-bill-url")
  const modale = document.querySelector('#modaleFileAdmin1')
  const modal = new bootstrap.Modal(modale)

  // Attendre que la modale soit visible pour calculer la largeur
  modale.addEventListener('shown.bs.modal', () => {
    const imgWidth = Math.floor(modale.getBoundingClientRect().width * 0.8)
    modale.querySelector(".modal-body").innerHTML =
      `<div style='text-align: center;'><img width=${imgWidth} src=${billUrl} alt="Bill"/></div>`
  }, { once: true })

  modal.show()
}
```

## Après

```js
export const handleClickIconEye = (document) => {
  const billUrl = document.querySelector('#icon-eye-d').getAttribute("data-bill-url")
  const modale = document.querySelector('#modaleFileAdmin1')
  const modal = new bootstrap.Modal(modale)

  modale.addEventListener('shown.bs.modal', () => {
    const modalBody = modale.querySelector(".modal-body")
    modalBody.innerHTML =
      `<div style="text-align: center;" class="bill-proof-container">
        <img src="${billUrl}" alt="Bill"
          style="max-width: 100%; max-height: 80vh; height: auto; object-fit: contain;" />
      </div>`
  }, { once: true })

  modal.show()
}
```

### Explication

Même problème que côté employee : `#modaleFileAdmin1` est l'élément `.modal` de Bootstrap (overlay plein écran), donc `getBoundingClientRect().width` retournait la largeur du viewport et non celle du `.modal-dialog`. L'image débordait du conteneur.

La solution est identique : utiliser des propriétés CSS responsives (`max-width: 100%`, `max-height: 80vh`, `height: auto`, `object-fit: contain`) au lieu d'une largeur fixe en pixels.


# Ajout Visibilité Doc (Admin)

- Dashboard.js

## Avant

```js
<div class="col-sm">
  <label for="file" class="bold-label">Justificatif</label>
    <div class='input-field input-flex file-flex'>
    <span id="file-name-admin">${bill.fileName}</span>
    ${bill.fileUrl && bill.fileUrl !== 'null' && !bill.fileUrl.includes('/null') ? 
      `<div class='icons-container'>
        <
      </div>` : ''}
  </div>
```

## Après

```js
<div class="col-sm">
  <label for="file" class="bold-label">Justificatif</label>
  <div class='input-field input-flex file-flex'>
    <span id='file-name-admin'> ${bill.fileName} </span>
    ${bill.fileUrl && bill.fileUrl !== 'null' && !bill.fileUrl.includes('/null') ?
      `<div class='icons-container'>
        <div id='icon-eye-d' data-testid='icon-eye-d' data-bill-url='${bill.fileUrl}' style='cursor: pointer;'>
          ${eyeWhite}
        </div>
      </div>` : ''}
  </div>
```


### Explication du problème

Le bouton pour voir le document n'a pas était mis pour le mode ADMIN

# Bills non triées par date

- BillsUI.js
- Bills.js

## Avant

BillsUI.js

```js
const rows = (data) => {
  return (data && data.length) ? data.map(bill => row(bill)).join("") : ""
}
```

Bills.js

```js
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
```

## Après

BillsUI.js

```js
const rows = (data) => {
  if (!data || !data.length) return ''
  //! Tri anti-chronologique du plus récent au plus ancien
  return [...data].sort((a, b) => new Date(b.date) - new Date(a.date)).map(bill => row(bill)).join('')
}

```
Bills.js

```js
try {
    const snapshot = await store.bills().list()

  const bills = snapshot
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(doc => {
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
```

### Explication du problème

Le test (Mock) exige que les notes de frais s'affichent triées de la plus récente à la plus ancienne. 

Sans .sort(), l'ordre dépend uniquement de ce que renvoie store.bills().list(), sans aucune garantie chronologique.

Cependant, Le tri doit impérativement se faire avant formatDate() : une fois la date reformatée (ex. "4 Avr. 04"), elle ne se compare plus correctement. Le tri fonctionne uniquement sur la date brute au format YYYY-MM-DD, via 
new Date(b.date) - new Date(a.date), 
car ce format ISO rend l'ordre alphabétique et chronologique équivalents.


# Certains Justificatif considérer comme Null

- BillsUI.js + DashboardFormUI.js

## Avant


BillsUI.js

(const hasValidFile exister pas ! )
```js
<td>
  ${Actions(bill.fileUrl)}
</td>

DashboardFormUI.js

<span id="file-name-admin">${bill.fileName}</span>
<div class='icons-container'>
  <span id="icon-eye-d" data-testid="icon-eye-d" data-bill-url="${bill.fileUrl}"> ${eyeWhite} </span>
</div>
```

## Après


BillsUI.js
```js
const hasValidFile =  bill.fileUrl && 
                      bill.fileUrl !== 'null' && 
                      !bill.fileUrl.includes('/null')

<td>
  ${hasValidFile ? Actions(bill.fileUrl) : ''}
</td>

DashboardFormUI.js

${bill.fileUrl && bill.fileUrl !== 'null' && !bill.fileUrl.includes('/null') ? 
  `<span id="file-name-admin">${bill.fileName}</span>
    <div class='icons-container'>
      <span id="icon-eye-d" data-testid="icon-eye-d" data-bill-url="${bill.fileUrl}"> ${eyeWhite} </span>
    </div>` 
: ''}
```

### Explication du problème

Les bills on été concu sans protection . C'est à dire que si le fichier n'existe pas, il y a pas de conditions qui va le cacher. C'est ce que j'ai ajouté pour User et coté RH


# Ajout d'une protection des factures (ne pas mettre des .mp3, .mp4 ...)
 
 - NewBill.js

## Avant



## Après
```js
  function isValidFileType(fileName) {
    const allowedExtensions = ['jpg', 'jpeg', 'png']
    const fileExtension = fileName.split('.').pop().toLowerCase()
    return allowedExtensions.includes(fileExtension)
  }

  if (!isValidFileType(fileName)) {
    alert('Veuillez sélectionner un fichier au format JPG, JPEG ou PNG.')
    document.querySelector(`input[data-testid="file"]`).value = ''
    return
  }
```

### Explication du problème

Ajout d'une function isValidFileType dans handleChangeFile qui permet de filtrer le type de fichier afin d'éviter de se retrouver avec des fichier null pour les factures


# Ajout sécurité sur le formulaire (Employee)

 - NewBill.js

## Avant
```js
  const bill = {
    email,
    type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
    name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
    amount: parseFloat(e.target.querySelector(`input[data-testid="amount"]`).value),
    date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
    vat: e.target.querySelector(`input[data-testid="vat"]`).value,
    pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
    commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
    fileUrl: billFileState.fileUrl,
    fileName: billFileState.fileName,
    status: 'pending'
  }

  updateBill(bill, { billId: billFileState.billId, store, onNavigate })
}
```


## Après
```js
  const bill = {
    email,
    type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
    name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
    amount: parseFloat(e.target.querySelector(`input[data-testid="amount"]`).value),
    date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
    vat: e.target.querySelector(`input[data-testid="vat"]`).value,
    pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
    commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
    fileUrl: billFileState.fileUrl,
    fileName: billFileState.fileName,
    status: 'pending'
  }

  if (bill.name === '') {
      alert('Veuillez saisir un nom de dépense')
      document.querySelector(`input[data-testid="expense-name"]`).value = ''
      return 
  }
  if (bill.amount === '' || isNaN(bill.amount)) {
      alert('Veuillez saisir un montant valide')
      document.querySelector(`input[data-testid="amount"]`).value = ''
      return 
  }
  if (bill.amount <= 0) {
      alert('Veuillez saisir un montant positif')
      document.querySelector(`input[data-testid="amount"]`).value = ''
      return 
  }
  if (bill.commentary.length < 5) {
      alert("Veuillez saisir un commentaire d'au moins 5 caractères")
      document.querySelector('textarea[data-testid="commentary"]').value = ''
      return
  }

  updateBill(bill, { billId: billFileState.billId, store, onNavigate })
}
```

### Explication du problème

Ajout de la sécurité côté Employee pour qu'il remplisses toutes les informations demandé, afin d'éviter a la RH de relancer le salarié avec des informations complémentaires ce qui évite de faire perdre du temps et donc de l'argent


# Correction OnNavigate pour (Employee)

- Router.js

## Avant
```js
const setActiveIcon = (iconNumber) => {
  const divIcon1 = document.getElementById('layout-icon1')
  const divIcon2 = document.getElementById('layout-icon2')

  if (!divIcon1 || !divIcon2) return

  if (iconNumber === 1) {
    divIcon1.classList.add('active-icon')
    divIcon2.classList.remove('active-icon')
  } else {
    divIcon1.classList.remove('active-icon')
    divIcon2.classList.add('active-icon')
  }
}
```

## Après
```js
const setActiveIcon = (iconNumber) => {
  const divIcon1 = document.getElementById('layout-icon1')
  const divIcon2 = document.getElementById('layout-icon2')

  if (!divIcon1 || !divIcon2) return

  divIcon1.classList.toggle('active-icon', iconNumber === 1)
  divIcon2.classList.toggle('active-icon', iconNumber === 2)

  divIcon1.onclick = () => window.onNavigate(ROUTES_PATH['Bills'])
  divIcon2.onclick = () => window.onNavigate(ROUTES_PATH['NewBill'])
}
```

### Explication du problème

setActiveIcon ne gérait que l'aspect visuel : elle ajoutait ou retirait la classe CSS 'active-icon' sur les deux icônes selon le numéro reçu. Aucun onclick n'était attaché aux icônes dans cette fonction, donc cliquer sur layout-icon1 ou layout-icon2 ne déclenchait aucune navigation



# Correction de la Notation (Si le RH Accepte ou Refuse) pour les notes de Frais (Admin)

- Dashboard.js

## Avant

```js
  const btnAccept = document.querySelector('#btn-accept-bill')
  if (btnAccept) btnAccept.addEventListener('click', (e) =>
    handleAcceptSubmit(e, bill, document))

  const btnRefuse = document.querySelector('#btn-refuse-bill')
  if (btnRefuse) btnRefuse.addEventListener('click', (e) =>
    handleRefuseSubmit(e, bill, document))
}
```

## Après

```js
const btnAccept = document.querySelector('#btn-accept-bill')
if (btnAccept) btnAccept.addEventListener('click', async (e) => {
  const newBillAccept = handleAcceptSubmit(e, bill, document)
  await updateBill(newBillAccept, store)
  if (typeof onNavigate === 'function') onNavigate(ROUTES_PATH.Dashboard)
})

const btnRefuse = document.querySelector('#btn-refuse-bill')
if (btnRefuse) btnRefuse.addEventListener('click', async (e) => {
  const newBillRefuse = handleRefuseSubmit(e, bill, document)
  await updateBill(newBillRefuse, store)
  if (typeof onNavigate === 'function') onNavigate(ROUTES_PATH.Dashboard)
})
}

//newBill c'est transformé en newBillAccept et newBillRefuse afin de séparer et d'éviter les mélanges de codes

```


### Explication du problème

Un probléme majeur et que il y avait le traitement de newBill pour Accepter et Refusé mais Bill était pas du tout maj donc il ne prennais pas les valeurs mise à jours ce qui entrainer aucun changements 


# Correction Beug Affichage entre deux type de fiche (Admin)

-Dashboard.js 

## Avant

```js
let dashboardState = {
  counter: undefined,
  index: undefined,
  id: undefined
}

/**
 * Gère l'édition d'un ticket
 * Exported for testing purposes
 */
export const handleEditTicket = (e, bill, bills, document, store, onNavigate) => {
  if (dashboardState.counter === undefined || dashboardState.id !== bill.id) {
    dashboardState.counter = 0
  }
  if (dashboardState.id === undefined || dashboardState.id !== bill.id) {
    dashboardState.id = bill.id
  }

  if (dashboardState.counter % 2 === 0) {
    bills.forEach(b => {
      const el = document.querySelector(`#open-bill${b.id}`)
      if (el) el.style.background = '#0D5AE5'
    })

    const billEl = document.querySelector(`#open-bill${bill.id}`)
    if (billEl) billEl.style.background = '#2A2B35'

    document.querySelector('.dashboard-right-container div').innerHTML = DashboardFormUI(bill)
    document.querySelector('.vertical-navbar').style.height = '150vh'
    dashboardState.counter++
  } else {
    const billEl = document.querySelector(`#open-bill${bill.id}`)
    if (billEl) billEl.style.background = '#0D5AE5'

    document.querySelector('.dashboard-right-container div').innerHTML = `
      <div id="big-billed-icon" data-testid="big-billed-icon"> ${BigBilledIcon} </div>
    `
    document.querySelector('.vertical-navbar').style.height = '120vh'
    dashboardState.counter++
  }


/**
 * Gère l'affichage/masquage des tickets
 * Exported for testing purposes
 */
export const handleShowTickets = (e, bills, index, document, store, onNavigate) => {
  if (dashboardState.counter === undefined || dashboardState.index !== index) {
    dashboardState.counter = 0
  }
  if (dashboardState.index === undefined || dashboardState.index !== index) {
    dashboardState.index = index
  }

  if (dashboardState.counter % 2 === 0) {
    const arrow = document.querySelector(`#arrow-icon${dashboardState.index}`)
    if (arrow) arrow.style.transform = 'rotate(0deg)'

    document.querySelector(`#status-bills-container${dashboardState.index}`)
      .innerHTML = cards(filteredBills(bills, getStatus(dashboardState.index)))

    dashboardState.counter++
  } else {
    const arrow = document.querySelector(`#arrow-icon${dashboardState.index}`)
    if (arrow) arrow.style.transform = 'rotate(90deg)'

    document.querySelector(`#status-bills-container${dashboardState.index}`)
      .innerHTML = ""

    dashboardState.counter++
  }

  bills.forEach(bill => {
    const openBill = document.querySelector(`#open-bill${bill.id}`)
    if (openBill) openBill.addEventListener('click', (e) =>
      handleEditTicket(e, bill, bills, document, store, onNavigate))
  })

  return bills
}


/**
 * Réinitialise l'état du dashboard (utile pour les tests)
 */
export const resetDashboardState = () => {
  dashboardState = {
    counter: undefined,
    index: undefined,
    id: undefined
  }
```

## Après

```js
let dashboardState = {
  openIndexes: new Set(),
  selectedBillId: undefined //La sélection d'un ticket
}

/**
 * Gère l'édition d'un ticket
 * Exported for testing purposes
 */
export const handleEditTicket = (e, bill, bills, document, store, onNavigate) => {
  const isSameBillAlreadyOpen = dashboardState.selectedBillId === bill.id

  // Remet en couleur neutre toutes les cards avant de mettre en avant la bonne
    bills.forEach(b => {
      const el = document.querySelector(`#open-bill${b.id}`)
      if (el) el.style.background = '#0D5AE5'
    })

  if (isSameBillAlreadyOpen) {
    // Toggle : on referme le formulaire si on reclique sur le même ticket
    dashboardState.selectedBillId = undefined

    document.querySelector('.dashboard-right-container div').innerHTML = `
      <div id="big-billed-icon" data-testid="big-billed-icon"> ${BigBilledIcon} </div>
    `
    document.querySelector('.vertical-navbar').style.height = '120vh'
    return
  }

  // Sélection d'un nouveau ticket
  dashboardState.selectedBillId = bill.id

  const billEl = document.querySelector(`#open-bill${bill.id}`)
  if (billEl) billEl.style.background = '#2A2B35'

  document.querySelector('.dashboard-right-container div').innerHTML = DashboardFormUI(bill)
  document.querySelector('.vertical-navbar').style.height = '150vh'


/**
 * Gère l'affichage/masquage des tickets
 * Exported for testing purposes
 */
export const handleShowTickets = (e, bills, index, document, store, onNavigate) => {
  const isCurrentlyOpen = dashboardState.openIndexes.has(index)
  const arrow = document.querySelector(`#arrow-icon${index}`)
  const container = document.querySelector(`#status-bills-container${index}`)

  if (isCurrentlyOpen) {
    // On referme cette liste précise
    dashboardState.openIndexes.delete(index)
    if (arrow) arrow.style.transform = 'rotate(0deg)'
    if (container) container.innerHTML = ""
    return
  }

  // On ouvre cette liste précise, sans toucher aux autres listes ni à la sélection en cours
  dashboardState.openIndexes.add(index)
  if (arrow) arrow.style.transform = 'rotate(90deg)'

  const statusBills = filteredBills(bills, getStatus(index))

  if (container) container.innerHTML = cards(statusBills)

  statusBills.forEach(bill => {
    const openBill = document.querySelector(`#open-bill${bill.id}`)
    if (openBill) openBill.addEventListener('click', (e) => 
      handleEditTicket(e, bill, bills, document, store, onNavigate))
  })
}

/**
 * Réinitialise l'état du dashboard (utile pour les tests)
 */
export const resetDashboardState = () => {
  dashboardState = { 
    openIndexes: new Set(), 
    selectedBillId: undefined 
  }
}
```


### Explication du problème
Lorsqu'une fiche était déjà ouverte et que je cliquais sur un ticket d'un autre statut (accepté ou refusé), celui-ci ne s'affichait pas : le ticket déjà ouvert se refermait bien, mais le nouveau ne s'ouvrait pas à sa place.

Le bug venait de la logique de base du code : un seul état (counter) servait à piloter l'affichage de tous les types de fiches confondus, en alternant simplement entre deux comportements selon sa parité (pair/impair), sans jamais vérifier quel ticket était réellement concerné. Ainsi, quand je cliquais sur un ticket différent, le code repassait dans la même fonction et exécutait la branche "fermeture" prévue pour le ticket précédent, au lieu de détecter qu'il s'agissait d'une nouvelle sélection à afficher. Le compteur ne distinguait donc pas "je referme le ticket actuel" de "j'ouvre un ticket différent" : il se contentait d'alterner, ce qui ne fonctionnait que si l'utilisateur recliquait toujours sur le même ticket.

Pour corriger ce comportement, j'ai remplacé cette logique de parité par un état explicite basé sur l'identité de l'élément concerné : selectedBillId pour savoir précisément quel ticket est ouvert, et un Set (openIndexes) pour gérer indépendamment l'ouverture de chaque section de statut. Chaque clic compare maintenant l'élément ciblé à l'état actuel, ce qui permet de distinguer clairement une fermeture (même ticket recliqué) d'un changement de sélection (ticket différent), et de garder plusieurs sections ouvertes en parallèle sans qu'elles interfèrent entre elles.




