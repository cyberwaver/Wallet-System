const BaseModel = require("../database/models/BaseModel");
const { ApplicationException } = require("../exceptions/index");

class DbManager {
  constructor() {}

  async persist(handler) {
    const trx = await BaseModel.startTransaction();
    try {
      const response = await handler.call(this, trx);
      await trx.commit();
      return response;
    } catch (err) {
      await trx.rollback();
      throw new ApplicationException("Error writing to the database", "DBError");
    }
  }
}

module.exports = DbManager;
