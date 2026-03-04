const pool = require("../config/db");

const getZones = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM zones");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getZones };