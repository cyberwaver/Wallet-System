const { ApplicationException } = require("../../../exceptions");

const WalletBalanceAfterDebitShouldNotBeLessThanMin = (wallet, amount, walletTypesRepo) => {
  const details = `Wallet balance after amount deduction would be less than minimum balance`;
  return {
    error: new ApplicationException(details, "WalletBalanceAfterDebitShouldNotBeLessThanMin"),
    isBroken: async () => {
      const walletType = await walletTypesRepo.getById(wallet.typeId);
      const debitBalance = wallet.balance - amount;
      return debitBalance < walletType.minBalance;
    },
  };
};

module.exports = WalletBalanceAfterDebitShouldNotBeLessThanMin;
