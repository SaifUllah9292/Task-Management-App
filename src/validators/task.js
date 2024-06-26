const { body, validationResult, param } = require('express-validator');

const add = () => {
  return [
    body('title', 'title is required').not().isEmpty(),
    body('userId', 'login user is required').not().isEmpty(),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).send({
    status: false,
    errors: extractedErrors,
  });
};

module.exports = { validate, add };
