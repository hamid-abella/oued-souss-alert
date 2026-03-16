// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/services/auth.service.js
// Description : Authentification JWT pour le RBAC
// Spec : RBAC obligatoire
// =============================================================

const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');

// Utilisateurs en dur pour la démo (remplacer par table users en prod)
const USERS = [
  { id: 1, nom: 'Admin',    email: 'admin@souss.ma',    password: bcrypt.hashSync('admin123', 10),    role: 'admin' },
  { id: 2, nom: 'Operateur',email: 'oper@souss.ma',     password: bcrypt.hashSync('oper123', 10),     role: 'operateur' },
  { id: 3, nom: 'Lecteur',  email: 'lecteur@souss.ma',  password: bcrypt.hashSync('lecteur123', 10),  role: 'lecteur' },
  { id: 4, nom: 'Securite', email: 'securite@souss.ma', password: bcrypt.hashSync('sec123', 10),      role: 'securite' },
];

const login = async (email, password) => {
  const user = USERS.find(u => u.email === email);

  if (!user) {
    throw new Error('Utilisateur non trouvé.');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('Mot de passe incorrect.');
  }

  // Génération du token JWT (expire en 8h)
  const token = jwt.sign(
    { id: user.id, nom: user.nom, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return { token, role: user.role, nom: user.nom };
};

module.exports = { login };