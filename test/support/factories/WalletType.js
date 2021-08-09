module.exports = (factory, { WalletTypeModel }) => {
  factory.define("WalletType", WalletTypeModel, {
    id: factory.chance("guid"),
    name: factory.chance("string"),
    minBalance: 0,
  });
};
