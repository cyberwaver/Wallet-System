const BaseRepo = require("./BaseRepo");
const WalletModel = require("../database/models/WalletModel");

class WalletsRepository extends BaseRepo {
  constructor() {
    super(WalletModel, { singularName: "wallet", pluralName: "wallets" });
  }
}

module.exports = WalletsRepository;
