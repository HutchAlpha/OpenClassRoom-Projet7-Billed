# OpenClassRoom-Projet7-Billed

Instaler les différents dépendances , voir les readme.md Back + Front

# Lancement projet une fois les dépendances installer

## BACK ##
cd Back
nvm use 18.16.1
npm run run:dev

## Front ##
cd Front
nvm use 18.16.1
live-server
npm run test

## Lancer les Test
(être dans le Front)
npm run test

----------------------------
### employé :
```
utilisateur : employee@test.tld
mot de passe : employee
```
### administrateur : 
```
utilisateur : admin@test.tld 
mot de passe : admin
```


----------------------------

## Organisation FRONT

Fixtures [DONNEEMOCK]
- bills

Bills (facture) [SALARIE]
- bills
- billsUI (TABLEAU NOTE DE FRAIS)

DashBoard [RH-ADMIN]
- Dashboard
- DashboardFormUI (Formulaire Edition Facture)
- DashBoardUI (Pending, Accepted, Refused)

LOGIN
| Login
| LoginUI (Formulaire connexion User / RH-Admin)

NewBill
| NewBill
| NewBillUI (Formulaire création note de Frais)