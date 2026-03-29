require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool   = require('./src/config/db');

async function resetPasswords() {
  const users = [
    { email: 'admin@souss.ma',    password: 'admin123',   oldRole: 'admin'    },
    { email: 'oper@souss.ma',     password: 'oper123',    oldRole: 'operator' },
    { email: 'lecteur@souss.ma',  password: 'lecteur123', oldRole: 'reader'   },
    { email: 'securite@souss.ma', password: 'sec123',     oldRole: 'security' },
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    const result = await pool.query(
      'UPDATE users SET email=$1, password=$2 WHERE role=$3 RETURNING email, role',
      [u.email, hash, u.oldRole]
    );
    if (result.rows.length > 0) {
      console.log(`✅ ${u.email} (${u.oldRole}) mis à jour`);
    } else {
      console.log(`❌ Aucun user trouvé pour le rôle: ${u.oldRole}`);
    }
  }

  await pool.end();
}

resetPasswords();