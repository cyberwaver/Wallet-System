const BaseModel = require("./BaseModel");

class TransactionModel extends BaseModel {
  static tableName = "transactions";

  static get relationMappings() {
    return {
      fromWallet: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: "WalletModel",
        join: {
          from: "transactions.fromWalletId",
          to: "wallets.id",
        },
      },
      toWallet: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: "WalletModel",
        join: {
          from: "transactions.toWalletId",
          to: "wallets.id",
        },
      },
    };
  }
}

module.exports = TransactionModel;
