const { expect } = require("chai");
const container = require("src/container");
const {
  ValidationException,
  NotFoundException,
  ApplicationException,
} = require("../../../../src/exceptions");
const factory = require("../../../support/factory");
const createWallet = container.resolve("createWallet");

describe("WALLET :: CreateWallet", function () {
  context("Validation", () => {
    context("When request data is missing important data attributes", async () => {
      const requestData = {};
      it("it should reject with a validation error", async () => {
        await expect(createWallet.execute(requestData)).to.be.rejectedWith(ValidationException);
      });
    });
    context("When user does not exist for 'ownerId' or wallet type does not exist for typeId", async () => {
      const requestData = { typeId: "TYPE_ID", ownerId: "USER_ID" };
      it("it should reject with a validation error", async () => {
        await expect(createWallet.execute(requestData)).to.be.rejectedWith(ValidationException);
      });
    });
  });

  context("When wallet has been successfully created", async () => {
    const requestData = { typeId: "TYPE_ID", ownerId: "USER_ID" };
    before(async () => {
      await factory.create("User", { id: "USER_ID" });
      await factory.create("WalletType", { id: "TYPE_ID" });
    });
    it("should return the new wallet data", async () => {
      const res = await createWallet.execute(requestData);
      expect(res.typeId).to.equal("TYPE_ID");
    });
  });
});
