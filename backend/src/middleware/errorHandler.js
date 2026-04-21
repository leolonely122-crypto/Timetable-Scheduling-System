const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Sequelize Unique Constraint Error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Resource already exists or scheduling conflict detected.',
      errors: err.errors.map(e => e.message)
    });
  }

  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Database validation failed.',
      errors: err.errors.map(e => e.message)
    });
  }

  // General Error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
