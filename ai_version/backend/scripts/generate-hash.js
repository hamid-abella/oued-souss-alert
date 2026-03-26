// Créer un fichier : backend/scripts/generate-hash.js
const bcrypt = require('bcryptjs');

const passwords = [
  { user: 'admin',    password: 'admin123'    },
  { user: 'oper',     password: 'oper123'     },
  { user: 'lecteur',  password: 'lecteur123'  },
  { user: 'securite', password: 'sec123'      },
];

passwords.forEach(async ({ user, password }) => {
  const hash = await bcrypt.hash(password, 10);
  console.log(`${user} : ${hash}`);
});