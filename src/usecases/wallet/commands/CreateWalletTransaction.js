const { WALLET_TRANSACTION_CREATED } = require("../../../event/events");

class CreateWalletTransaction {
  constructor({ eventPublisher }) {
    this.eventPublisher = eventPublisher;
  }

  async execute(requestData, txnModule) {
    const txn = await txnModule.createNewTxn(requestData);
    this.eventPublisher.publish(WALLET_TRANSACTION_CREATED, txn);
    return txn;
  }
}

module.exports = CreateWalletTransaction;
