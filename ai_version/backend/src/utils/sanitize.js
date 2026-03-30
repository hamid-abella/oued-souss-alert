// Validates that a value is a positive integer (used for route :id params).
// Throws an error caught by errorHandler → 400 response.
const sanitizeId = (value, label = 'ID') => {
  const id = parseInt(value, 10);
  if (isNaN(id) || id < 1)
    throw Object.assign(new Error(`Invalid ID: ${label} must be a positive integer.`), { status: 400 });
  return id;
};

// Validates that a numeric value falls within [min, max].
// Throws an error caught by errorHandler → 400 response.
const sanitizeNumeric = (value, label, min, max) => {
  const num = parseFloat(value);
  if (isNaN(num) || num < min || num > max)
    throw Object.assign(
      new Error(`Value out of range: ${label} must be between ${min} and ${max}.`),
      { status: 400 }
    );
  return num;
};

module.exports = { sanitizeId, sanitizeNumeric };