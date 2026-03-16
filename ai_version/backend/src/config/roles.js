/*
Définition des rôles dans le système
Permet de contrôler l'accès aux endpoints
*/

const ROLES = {

  ADMIN: "admin",
  TECHNICIEN: "technicien",
  OBSERVATEUR: "observateur"

};


/*
Permissions par rôle
*/

const ROLE_PERMISSIONS = {

  admin: [
    "create_zone",
    "delete_zone",
    "manage_sensors",
    "manage_alerts"
  ],

  technicien: [
    "manage_sensors",
    "view_alerts"
  ],

  observateur: [
    "view_dashboard"
  ]

};

module.exports = {
  ROLES,
  ROLE_PERMISSIONS
};