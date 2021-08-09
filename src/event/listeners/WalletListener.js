const {
  WALLET_CREATED,
  WALLET_TRANSACTION_CREATED,
  WALLET_TRANSACTION_PROCESSED,
  WALLET_TYPE_CREATED,
} = require("../events");
const BaseListener = require("./BaseListener");

class WalletListener extends BaseListener {
  constructor({
    updateStatsApplicationMeta,
    processWalletTransaction,
    walletTopupTxnModule,
    walletTransferTxnModule,
    queueManager,
  }) {
    super();
    this.updateStatsApplicationMeta = updateStatsApplicationMeta;
    this.processWalletTransaction = processWalletTransaction;
    this.walletTopupTxnModule = walletTopupTxnModule;
    this.walletTransferTxnModule = walletTransferTxnModule;
    this.queueManager = queueManager;
    this.setupSubscriptions();
  }
  setupSubscriptions() {
    this.listenTo(WALLET_CREATED, this._updateAppMetaWalletCount);
    this.listenTo(WALLET_TRANSACTION_CREATED, this._processTxn);
    this.listenTo(WALLET_TYPE_CREATED, this._updateAppMetaWalletTypeCount);
    this.listenTo(
      WALLET_TRANSACTION_PROCESSED,
      this._updateAppMetaTxnVolumeTotal,
      this._onTopupTxnType__updateAppMetaWalletBalanceTotal
    );
  }

  async _updateAppMetaWalletCount() {
    this.queueManager.add(() => this.updateStatsApplicationMeta.execute("walletCount", "INCREASE"));
  }

  async _processTxn({ data: txn }) {
    const txnModuleForTypeHash = {
      TRANSFER: this.walletTransferTxnModule,
      TOPUP: this.walletTopupTxnModule,
    };
    const txnModule = txnModuleForTypeHash[txn.type];
    this.queueManager.add(() => this.processWalletTransaction.execute(txn, txnModule));
  }

  async _onTopupTxnType__updateAppMetaWalletBalanceTotal({ data: txn }) {
    if (txn.type !== "TOPUP") return;
    this.queueManager.add(() =>
      this.updateStatsApplicationMeta.execute("walletBalanceTotal", "INCREASE", txn.amount)
    );
  }

  async _updateAppMetaTxnVolumeTotal({ data: txn }) {
    this.queueManager.add(() =>
      this.updateStatsApplicationMeta.execute("txnVolumeTotal", "INCREASE", txn.amount)
    );
  }

  async _updateAppMetaWalletTypeCount() {
    this.queueManager.add(() => this.updateStatsApplicationMeta.execute("walletTypeCount", "INCREASE"));
  }
}

module.exports = WalletListener;
