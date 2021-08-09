const Joi = require("joi");
const generateJoiValidationError = require("../utils/generateJoiValidationError");
const validateSchema = require("../utils/schema-validator");

class UserValidator {
  constructor({ usersRepository }) {
    this.usersRepo = usersRepository;
  }

  async validateNewUserData(data) {
    return await validateSchema(
      Joi.object({
        firstName: Joi.string().min(1).max(30).required(),
        lastName: Joi.string().min(1).max(30).required(),
        email: Joi.string()
          .required()
          .external(async (email, helper) => {
            const userExists = await this.usersRepo.recordExistForAttributes({ email });
            if (!userExists) return;
            throw generateJoiValidationError("Email is associated with a user account", "email");
          }),
      }),
      data
    );
  }
}

module.exports = UserValidator;
