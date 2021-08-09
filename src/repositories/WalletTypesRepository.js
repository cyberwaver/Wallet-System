const BaseRepo = require("./BaseRepo");
const WalletTypeModel = require("../database/models/WalletTypeModel");

class WalletTypesRepository extends BaseRepo {
  constructor() {
    super(WalletTypeModel, { singularName: "wallet type", pluralName: "wallet types" });
  }
}

module.exports = WalletTypesRepository;
