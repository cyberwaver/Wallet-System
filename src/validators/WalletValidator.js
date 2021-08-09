const Joi = require("joi");
const generateJoiValidationError = require("../utils/generateJoiValidationError");
const validateSchema = require("../utils/schema-validator");

class WalletValidator {
  constructor({ walletsRepository, walletTypesRepository, usersRepository }) {
    this.walletsRepo = walletsRepository;
    this.walletTypesRepo = walletTypesRepository;
    this.usersRepo = usersRepository;
  }

  async validateNewWalletTypeData(data) {
    return await validateSchema(
      Joi.object({
        name: Joi.string().required(),
        minBalance: Joi.number(),
      }),
      data
    );
  }

  async validateNewWalletData(data) {
    return await validateSchema(
      Joi.object({
        ownerId: Joi.string()
          .required()
          .external(async (ownerId) => {
            const userExists = await this.usersRepo.recordExistsForId(ownerId);
            if (userExists) return;
            throw generateJoiValidationError("User does not exist for ID", "ownerId");
          }),
        typeId: Joi.string()
          .required()
          .external(async (typeId) => {
            const walletTypeExists = await this.walletTypesRepo.recordExistsForId(typeId);
            if (walletTypeExists) return;
            throw generateJoiValidationError("Wallet type does not exist for ID", "typeId");
          }),
      }),
      data
    );
  }

  async validateNewWalletTransferTxnData(data) {
    return await validateSchema(
      Joi.object({
        amount: Joi.number().min(1).required(),
        fromWalletId: Joi.string()
          .required()
          .external(async (id) => {
            const walletExists = await this.walletsRepo.recordExistsForId(id);
            if (walletExists) return;
            throw generateJoiValidationError("Wallet does not exist for sender", "fromWalletId");
          }),
        toWalletId: Joi.string()
          .required()
          .external(async (id) => {
            const walletExists = await this.walletsRepo.recordExistsForId(id);
            if (walletExists) return;
            throw generateJoiValidationError("Wallet does not exist for receiver", "fromWalletId");
          }),
      }),
      data
    );
  }

  async validateNewWalletTopupTxnData(data) {
    return await validateSchema(
      Joi.object({
        amount: Joi.number().min(1).required(),
        toWalletId: Joi.string()
          .required()
          .external(async (id) => {
            const walletExists = await this.walletsRepo.recordExistsForId(id);
            if (walletExists) return;
            throw generateJoiValidationError("Wallet does not exist for ID");
          }),
      }),
      data
    );
  }
}

module.exports = WalletValidator;
