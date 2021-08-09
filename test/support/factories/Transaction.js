module.exports = (factory, { TransactionModel }) => {
  factory.define("Transaction", TransactionModel, {
    id: factory.chance("guid"),
    type: "TRANSFER",
    status: "PENDING",
    fromWalletId: factory.chance("guid"),
    toWalletId: factory.chance("guid"),
    amount: factory.chance("number"),
    processedAt: undefined,
  });
};
