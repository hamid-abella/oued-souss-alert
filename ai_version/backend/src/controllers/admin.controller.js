const adminService = require('../services/admin.service');

const archiveMeasurements = async (req, res, next) => {
  try {
    await adminService.archiveMeasurements(req.body.cutoff_date);
    res.json({
      message:     'Archive completed successfully',
      cutoff_date: req.body.cutoff_date
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { archiveMeasurements };