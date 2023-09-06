const { validationResult, body } = require("express-validator");
const validationMiddleware = [
  body("username").not().isEmpty().withMessage("Username is required."),
  body("password").not().isEmpty().withMessage("Password is required."),
];

module.exports = {
  validationResult,
  validationMiddleware,
};
