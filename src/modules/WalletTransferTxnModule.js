const { ApplicationException } = require("../exceptions");
const checkRule = require("../utils/checkRule");
const {
  WalletTransferTxnCannotBeBetweenSameWallets,
  WalletBalanceShouldNotBeLessThanAmount,
  WalletBalanceAfterDebitShouldNotBeLessThanMin,
} = require("../usecases/wallet/rules/wallet.rules");

class WalletTransferTxnModule {
  constructor({
    walletsRepository,
    walletTypesRepository,
    transactionsRepository,
    walletValidator,
    dbManager,
  }) {
    this.walletsRepo = walletsRepository;
    this.walletTypesRepo = walletTypesRepository;
    this.transactionsRepo = transactionsRepository;
    this.walletValidator = walletValidator;
    this.dbManager = dbManager;
  }

  async createNewTxn(txnData) {
    const data = await this.walletValidator.validateNewWalletTransferTxnData(txnData);
    await checkRule(WalletTransferTxnCannotBeBetweenSameWallets(data.fromWalletId, data.toWalletId));
    const wallet = await this.walletsRepo.getById(data.fromWalletId);
    await checkRule(WalletBalanceShouldNotBeLessThanAmount(wallet, data.amount));
    await checkRule(WalletBalanceAfterDebitShouldNotBeLessThanMin(wallet, data.amount, this.walletTypesRepo));
    const txn = await this.transactionsRepo.add({
      fromWalletId: data.fromWalletId,
      toWalletId: data.toWalletId,
      amount: data.amount,
      type: "TRANSFER",
    });
    return txn;
  }

  async processTxn(txn) {
    this._throwOn__TxnIsNotOfTransferType(txn);
    const fromWallet = await this.walletsRepo.getById(txn.fromWalletId);
    await this._throwOn__TxnDidNotPassSenderWalletBalanceConstraintsCheck(txn, fromWallet);
    const toWallet = await this.walletsRepo.getById(txn.toWalletId);
    await this._updateParticipatingWalletsBalance(txn, fromWallet, toWallet);
    const transaction = await this.transactionsRepo.updateById(txn.id, {
      status: "SUCCESS",
      processedAt: new Date(),
    });
    return transaction;
  }

  _throwOn__TxnIsNotOfTransferType(txn) {
    if (txn.type === "TRANSFER") return;
    throw new ApplicationException("Wallet transaction is not of type: TRANSFER");
  }

  async _throwOn__TxnDidNotPassSenderWalletBalanceConstraintsCheck(txn, wallet) {
    //re-check wallet balance and minBalance constraint
    await checkRule(WalletBalanceShouldNotBeLessThanAmount(wallet, txn.amount));
    await checkRule(WalletBalanceAfterDebitShouldNotBeLessThanMin(wallet, txn.amount, this.walletTypesRepo));
  }

  async _updateParticipatingWalletsBalance(txn, fromWallet, toWallet) {
    await this.dbManager.persist(async (trx) => {
      //runs the 2 important mutation queries with a transaction (all or nothing).
      await this.walletsRepo.updateById(fromWallet.id, { balance: fromWallet.balance - txn.amount }, trx);
      await this.walletsRepo.updateById(toWallet.id, { balance: toWallet.balance + txn.amount });
    });
  }
}

module.exports = WalletTransferTxnModule;
