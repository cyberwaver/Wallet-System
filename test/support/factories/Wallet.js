module.exports = (factory, { WalletModel }) => {
  factory.define("Wallet", WalletModel, {
    id: factory.chance("guid"),
    ownerId: factory.chance("guid"),
    typeId: factory.chance("guid"),
    balance: "0",
  });
};
