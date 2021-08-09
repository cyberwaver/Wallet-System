const { Router } = require("express");
const Status = require("http-status");
const BaseController = require("./BaseController");
const router = Router();

class WalletController extends BaseController {
  get router() {
    router.get("/types/:id", this.getWalletType.bind(this));
    router.get("/types", this.getWalletTypes.bind(this));
    router.get("/:id", this.getWallet.bind(this));
    router.get("/", this.getWallets.bind(this));
    router.post("/", this.createWallet.bind(this));
    router.post("/types", this.addNewWalletType.bind(this));
    router.post("/topup", this.createWalletTopupTxn.bind(this));
    router.post("/transfer", this.createWalletTransferTxn.bind(this));
    return router;
  }

  async getWallet(req, res) {
    const { getUser, getWallet, getWalletTransactions, getWalletType } = req.container.cradle;
    this.task(async () => {
      const wallet = await getWallet.execute(req.params.id);
      wallet.owner = await getUser.execute(wallet.ownerId);
      wallet.type = await getWalletType.execute(wallet.typeId);
      wallet.transactions = await getWalletTransactions.execute(wallet.id);
      return wallet;
    }).execute(res);
  }

  async getWallets(req, res) {
    const { getWallets } = req.container.cradle;
    this.task(getWallets, this.extractPaginationOpts(req.query)).execute(res);
  }

  async createWallet(req, res) {
    const { createWallet } = req.container.cradle;
    this.task(createWallet, req.body).onSuccess(Status.ACCEPTED, "Wallet created successfully").execute(res);
  }

  async addNewWalletType(req, res) {
    const { createWalletType } = req.container.cradle;
    this.task(createWalletType, req.body)
      .onSuccess(Status.ACCEPTED, "Wallet type added successfully")
      .execute(res);
  }

  async getWalletTypes(req, res) {
    const { getWalletTypes } = req.container.cradle;
    this.task(getWalletTypes).execute(res);
  }

  async getWalletType(req, res) {
    const { getWalletType } = req.container.cradle;
    this.task(getWalletType, req.params.id).execute(res);
  }

  async createWalletTopupTxn(req, res) {
    const { createWalletTransaction, walletTopupTxnModule } = req.container.cradle;
    this.task(createWalletTransaction, req.body, walletTopupTxnModule)
      .onSuccess(Status.ACCEPTED, "Wallet topup transaction created successfully")
      .execute(res);
  }

  async createWalletTransferTxn(req, res) {
    const { createWalletTransaction, walletTransferTxnModule } = req.container.cradle;
    this.task(createWalletTransaction, req.body, walletTransferTxnModule)
      .onSuccess(Status.ACCEPTED, "Wallet transfer transaction created successfully")
      .execute(res);
  }
}

module.exports = WalletController;
