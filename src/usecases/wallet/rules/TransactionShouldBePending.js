const { ApplicationException } = require("../../../exceptions");

const TransactionShouldBePending = (txn) => {
  const details = `Transaction is not pending`;
  return {
    error: new ApplicationException(details, "TransactionShouldBePending"),
    isBroken: async () => {
      return txn.status !== "PENDING";
    },
  };
};

module.exports = TransactionShouldBePending;
