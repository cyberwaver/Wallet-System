const _ = require("lodash");
const { ApplicationException } = require("../exceptions");

class WalletTopupTxnModule {
  constructor({ walletsRepository, walletTypesRepository, transactionsRepository, walletValidator }) {
    this.walletsRepo = walletsRepository;
    this.walletTypesRepo = walletTypesRepository;
    this.transactionsRepo = transactionsRepository;
    this.walletValidator = walletValidator;
  }

  async createNewTxn(txnData) {
    const data = await this.walletValidator.validateNewWalletTopupTxnData(txnData);
    const txn = await this.transactionsRepo.add({
      toWalletId: data.toWalletId,
      amount: data.amount,
      type: "TOPUP",
    });
    return txn;
  }

  async processTxn(txn) {
    this._throwOn__TxnIsNotOfTransferType(txn);
    const wallet = await this.walletsRepo.getById(txn.toWalletId);
    await this.walletsRepo.updateById(wallet.id, { balance: wallet.balance + txn.amount });
    const transaction = await this.transactionsRepo.updateById(txn.id, {
      status: "SUCCESS",
      processedAt: new Date(),
    });
    return transaction;
  }

  _throwOn__TxnIsNotOfTransferType(txn) {
    if (txn.type === "TOPUP") return;
    throw new ApplicationException("Wallet transaction is not of type: TOPUP");
  }
}

module.exports = WalletTopupTxnModule;
