const { expect } = require("chai");
const container = require("src/container");
const { ValidationException, ApplicationException } = require("../../../../src/exceptions");
const factory = require("../../../support/factory");
const processWalletTransaction = container.resolve("processWalletTransaction");
const walletTopupTxnModule = container.resolve("walletTopupTxnModule");
const walletTransferTxnModule = container.resolve("walletTransferTxnModule");
const walletsRepo = container.resolve("walletsRepository");

describe("WALLET :: ProcessWalletTransaction", function () {
  context("TOPUP ::", () => {
    context("When topup transaction has been processed", async () => {
      before(async () => {
        await factory.create("User", { id: "USER_ID" });
        await factory.create("WalletType", { id: "TYPE_ID" });
        await factory.create("Wallet", {
          id: "TO_WALLET_ID",
          typeId: "TYPE_ID",
          ownerId: "USER_ID",
          balance: "10000",
        });
        await factory.create("Transaction", {
          id: "TXN_ID",
          toWalletId: "TO_WALLET_ID",
          amount: 10000,
          status: "PENDING",
          type: "TOPUP",
        });
      });
      it("should change transaction status and update receiver wallet balance", async () => {
        const txn = await processWalletTransaction.execute("TXN_ID", walletTopupTxnModule);
        const receiverWallet = await walletsRepo.getById("TO_WALLET_ID");
        expect(txn.status).to.equal("SUCCESS");
        expect(receiverWallet.balance).to.equal(20000);
      });
    });
  });

  context("TRANSFER ::", () => {
    context("When transfer transaction has been processed", async () => {
      before(async () => {
        await factory.create("User", { id: "USER_ID" });
        await factory.create("WalletType", { id: "TYPE_ID" });
        await factory.createMany("Wallet", [
          { id: "FROM_WALLET_ID", typeId: "TYPE_ID", ownerId: "USER_ID", balance: "30000" },
          { id: "TO_WALLET_ID", typeId: "TYPE_ID", ownerId: "USER_ID", balance: "1000" },
        ]);
        await factory.create("Transaction", {
          id: "TXN_ID",
          fromWalletId: "FROM_WALLET_ID",
          toWalletId: "TO_WALLET_ID",
          amount: 10000,
          status: "PENDING",
          type: "TRANSFER",
        });
      });
      it("should change transaction status and update associated wallet balances", async () => {
        const txn = await processWalletTransaction.execute("TXN_ID", walletTransferTxnModule);
        const senderWallet = await walletsRepo.getById("FROM_WALLET_ID");
        const receiverWallet = await walletsRepo.getById("TO_WALLET_ID");
        expect(txn.status).to.equal("SUCCESS");
        expect(senderWallet.balance).to.equal(20000);
        expect(receiverWallet.balance).to.equal(11000);
      });
    });
  });
});
