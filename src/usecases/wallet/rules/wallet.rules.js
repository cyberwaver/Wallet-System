const WalletBalanceShouldNotBeLessThanAmount = require("./WalletBalanceShouldNotBeLessThanAmount");
const WalletBalanceAfterDebitShouldNotBeLessThanMin = require("./WalletBalanceAfterDebitShouldNotBeLessThanMin");
const WalletTransferTxnCannotBeBetweenSameWallets = require("./WalletTransferTxnCannotBeBetweenSameWallets");
const TransactionShouldBePending = require("./TransactionShouldBePending");

module.exports = {
  WalletBalanceShouldNotBeLessThanAmount,
  WalletBalanceAfterDebitShouldNotBeLessThanMin,
  WalletTransferTxnCannotBeBetweenSameWallets,
  TransactionShouldBePending,
};
