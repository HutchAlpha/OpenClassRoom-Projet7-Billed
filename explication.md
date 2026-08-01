Lancer les test : npm run test


# Problème connexion Admin

- Login.js

## Avant
  const user = {
    type: "Admin",
    email: e.target.querySelector(`input[data-testid="  //employee//  -email-input"]`).value,
    password: e.target.querySelector(`input[data-testid="  //employee//  -password-input"]`).value,
    status: "connected"
  }

##  Après
  const user = {
    type: "Admin",
    email: e.target.querySelector(`input[data-testid="admin-email-input"]`).value,
    password: e.target.querySelector(`input[data-testid="admin-password-input"]`).value,
    status: "connected"
  }

### Explication du problème
Emplyee a été mis au lieu de user donc type été a null a cause de cela



# Images trop grande par rapport a l'affichages (Employee)

- Bills.js

## Avant

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

## Après

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



# Bills non triées par date

- BillsUI.js

## Avant

```js
const rows = (data) => {
  return (data && data.length) ? data.map(bill => row(bill)).join("") : ""
}
```

## Après

```js
const rows = (data) => {
  if (!data || !data.length) return ""
  //! Tri anti-chronologique (du plus récent au plus ancien)
  const sortedData = [...data].sort((a, b) => (a.date < b.date ? 1 : -1))
  return sortedData.map(bill => row(bill)).join("")
}
```

### Explication du problème

Les bills s'affichaient dans l'ordre des fixtures, sans tri. 

Problémes, le test vérifiait que les dates étaient triées du plus récent au plus ancien ce qui échouait.
