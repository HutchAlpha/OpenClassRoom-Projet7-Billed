# Problème connexion Admin

Avant
  const user = {
    type: "Admin",
    email: e.target.querySelector(`input[data-testid="  //employee//  -email-input"]`).value,
    password: e.target.querySelector(`input[data-testid="  //employee//  -password-input"]`).value,
    status: "connected"
  }

Après
  const user = {
    type: "Admin",
    email: e.target.querySelector(`input[data-testid="admin-email-input"]`).value,
    password: e.target.querySelector(`input[data-testid="admin-password-input"]`).value,
    status: "connected"
  }

Emplyee a été mis au lieu de user donc type été a null a cause de cela