const { expect } = require("chai");
const container = require("src/container");
const { ValidationException, ApplicationException } = require("../../../../src/exceptions");
const factory = require("../../../support/factory");
const createWalletTxn = container.resolve("createWalletTransaction");
const walletTopupTxnModule = container.resolve("walletTopupTxnModule");
const walletTransferTxnModule = container.resolve("walletTransferTxnModule");

describe("WALLET :: CreateWalletTxn", function () {
  context("TOPUP ::", () => {
    context("Validation", () => {
      context("When request data is missing important data attributes", async () => {
        const requestData = {};
        it("should reject with a validation error", async () => {
          await expect(createWalletTxn.execute(requestData, walletTopupTxnModule)).to.be.rejectedWith(
            ValidationException
          );
        });
      });
      context("When wallet does not exist for receiver", async () => {
        const requestData = { toWalletId: "WALLET_ID", amount: 10000 };
        it("should reject with a validation error", async () => {
          await expect(createWalletTxn.execute(requestData, walletTopupTxnModule)).to.be.rejectedWith(
            ValidationException
          );
        });
      });
    });
    context("When topup transaction has been created", async () => {
      const requestData = { toWalletId: "WALLET_ID", amount: 10000 };
      before(async () => {
        await factory.create("User", { id: "USER_ID" });
        await factory.create("WalletType", { id: "TYPE_ID" });
        await factory.create("Wallet", { id: "WALLET_ID", typeId: "TYPE_ID", ownerId: "USER_ID" });
      });
      it("should return the new wallet data", async () => {
        const txn = await createWalletTxn.execute(requestData, walletTopupTxnModule);
        expect(txn.type).to.equal("TOPUP");
      });
    });
  });

  context("TRANSFER ::", () => {
    context("Validation", () => {
      context("When request data is missing important data attributes", async () => {
        const requestData = {};
        it("should reject with a validation error", async () => {
          await expect(createWalletTxn.execute(requestData, walletTransferTxnModule)).to.be.rejectedWith(
            ValidationException
          );
        });
      });
      context("When wallet does not exist for receiver", async () => {
        const requestData = { fromWalletId: "FROM_WALLET_ID", toWalletId: "TO_WALLET_ID", amount: 10000 };
        it("should reject with a validation error", async () => {
          await expect(createWalletTxn.execute(requestData, walletTransferTxnModule)).to.be.rejectedWith(
            ValidationException
          );
        });
      });
    });

    context("When sender wallet balance is lesser than amount", async () => {
      const requestData = { fromWalletId: "FROM_WALLET_ID", toWalletId: "TO_WALLET_ID", amount: 10000 };
      before(async () => {
        await factory.create("User", { id: "USER_ID" });
        await factory.create("WalletType", { id: "TYPE_ID" });
        await factory.createMany("Wallet", [
          { id: "FROM_WALLET_ID", typeId: "TYPE_ID", ownerId: "USER_ID", balance: "1000" },
          { id: "TO_WALLET_ID", typeId: "TYPE_ID", ownerId: "USER_ID" },
        ]);
      });
      it("should throw an application error with key: 'WalletBalanceShouldNotBeLessThanAmount'", async () => {
        try {
          await createWalletTxn.execute(requestData, walletTransferTxnModule);
        } catch (e) {
          expect(e).to.be.instanceOf(ApplicationException);
          expect(e.key).to.equal("WalletBalanceShouldNotBeLessThanAmount");
        }
      });
    });

    context(
      "When sender wallet balance would be lesser than wallet type minimum balance after debit",
      async () => {
        const requestData = { fromWalletId: "FROM_WALLET_ID", toWalletId: "TO_WALLET_ID", amount: 10000 };
        before(async () => {
          await factory.create("User", { id: "USER_ID" });
          await factory.create("WalletType", { id: "TYPE_ID", minBalance: 2000 });
          await factory.createMany("Wallet", [
            { id: "FROM_WALLET_ID", typeId: "TYPE_ID", ownerId: "USER_ID", balance: "11000" },
            { id: "TO_WALLET_ID", typeId: "TYPE_ID", ownerId: "USER_ID" },
          ]);
        });
        it("should throw an application error with key: 'WalletBalanceAfterDebitShouldNotBeLessThanMin'", async () => {
          createWalletTxn.execute(requestData, walletTransferTxnModule).catch((e) => {
            expect(e).to.be.instanceOf(ApplicationException);
            expect(e.key).to.equal("WalletBalanceAfterDebitShouldNotBeLessThanMin");
          });
        });
      }
    );

    context("When transfer transaction has been created", async () => {
      const requestData = { fromWalletId: "FROM_WALLET_ID", toWalletId: "TO_WALLET_ID", amount: 10000 };
      before(async () => {
        await factory.create("User", { id: "USER_ID" });
        await factory.create("WalletType", { id: "TYPE_ID" });
        await factory.createMany("Wallet", [
          { id: "FROM_WALLET_ID", typeId: "TYPE_ID", ownerId: "USER_ID", balance: "30000" },
          { id: "TO_WALLET_ID", typeId: "TYPE_ID", ownerId: "USER_ID" },
        ]);
      });
      it("should return the new wallet data", async () => {
        const txn = await createWalletTxn.execute(requestData, walletTransferTxnModule);
        expect(txn.type).to.equal("TRANSFER");
      });
    });
  });
});
