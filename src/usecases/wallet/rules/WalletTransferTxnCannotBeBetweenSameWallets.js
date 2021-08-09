const { ApplicationException } = require("../../../exceptions");

const WalletTransferTxnCannotBeBetweenSameWallets = (senderWalletId, receiverWalletId) => {
  const details = `Wallet transfer transaction cannot be initiated for the same wallets`;
  return {
    error: new ApplicationException(details, "WalletTransferTxnCannotBeBetweenSameWallets"),
    isBroken: async () => senderWalletId === receiverWalletId,
  };
};

module.exports = WalletTransferTxnCannotBeBetweenSameWallets;
