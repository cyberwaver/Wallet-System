const _ = require("lodash");
const { WALLET_TRANSACTION_PROCESSED } = require("../../../event/events");
const checkRule = require("../../../utils/checkRule");
const { TransactionShouldBePending } = require("../rules/wallet.rules");

//ADVICE: This function should be run by a synchronous queue
//a 'WALLET_TRANSACTION_CREATED' event listener will add an instance of this class to the queue
//i.e, if there are 10 instances of this class to be run, the execution should be done one by one using FIFO (First-In, First-Out)
//Since the balances of 'from' & 'to' are mutated by this function,the in-app queue should guard against race-conditions.
class ProcessWalletTransaction {
  constructor({ transactionsRepository, eventPublisher }) {
    this.transactionsRepo = transactionsRepository;
    this.eventPublisher = eventPublisher;
  }

  async execute(txnOrId, txnModule) {
    const txn = await this._getTxn(txnOrId);
    await checkRule(TransactionShouldBePending(txn));
    try {
      const processedTxn = await txnModule.processTxn(txn);
      this.eventPublisher.publish(WALLET_TRANSACTION_PROCESSED, processedTxn);
      return processedTxn;
    } catch (err) {
      const transaction = await this.transactionsRepo.updateById(txn.id, {
        status: "FAILED",
        comment: err.message,
        processedAt: new Date(),
      });
      this.eventPublisher.publish(WALLET_TRANSACTION_PROCESSED, transaction);
      throw err;
    }
  }

  async _getTxn(txnOrId) {
    if (_.isObject(txnOrId)) return txnOrId;
    return await this.transactionsRepo.getById(txnOrId);
  }
}

module.exports = ProcessWalletTransaction;
