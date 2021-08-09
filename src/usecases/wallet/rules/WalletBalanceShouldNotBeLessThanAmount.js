const { ApplicationException } = require("../../../exceptions");

const WalletBalanceShouldNotBeLessThanAmount = (wallet, amount) => {
  const details = `Wallet balance after amount deduction would be less than minimum balance`;
  return {
    error: new ApplicationException(details, "WalletBalanceShouldNotBeLessThanAmount"),
    isBroken: async () => {
      return wallet.balance >= amount ? false : true;
    },
  };
};

module.exports = WalletBalanceShouldNotBeLessThanAmount;
