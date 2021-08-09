const { ref } = require("objection");
const BaseRepo = require("./BaseRepo");
const TransactionModel = require("../database/models/TransactionModel");

class TransactionsRepository extends BaseRepo {
  constructor() {
    super(TransactionModel, { singularName: "transaction", pluralName: "transactions" });
  }

  async getWalletTxns(walletId, paginationOpts) {
    const response = await this._getListOptsQuery(paginationOpts).where((query) =>
      query
        .where("transactions.fromWalletId", "=", walletId)
        .orWhere("transactions.toWalletId", "=", walletId)
    );

    return this.modelToJSON(response);
  }

  async getUserWalletsTxns(userId, paginationOpts) {
    const response = await this._getListOptsQuery(paginationOpts)
      .leftJoinRelated("fromWallet")
      .leftJoinRelated("toWallet")
      .where((query) =>
        query.where("fromWallet.ownerId", "=", userId).orWhere("toWallet.ownerId", "=", userId)
      )
      .andWhere((query) =>
        query
          .where("transactions.fromWalletId", "=", ref("fromWallet.id"))
          .orWhere("transactions.toWalletId", "=", ref("toWallet.id"))
      );

    return this.modelToJSON(response);
  }
}

module.exports = TransactionsRepository;
