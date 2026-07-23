const db = require('../config/db');

const archiveMeasurements = async (cutoffDate) => {
  await db.query('CALL archive_old_measurements($1)', [cutoffDate]);
};

module.exports = { archiveMeasurements };