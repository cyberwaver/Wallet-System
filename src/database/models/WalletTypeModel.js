const BaseModel = require("./BaseModel");

class WalletTypeModel extends BaseModel {
  static tableName = "wallet_types";

  static get jsonAttributes() {
    return [];
  }

  static get relationMappings() {}
}

module.exports = WalletTypeModel;
