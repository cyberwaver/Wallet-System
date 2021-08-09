const BaseModel = require("./BaseModel");

class WalletModel extends BaseModel {
  static tableName = "wallets";

  static get jsonAttributes() {
    return [];
  }

  static get relationMappings() {}
}

module.exports = WalletModel;
