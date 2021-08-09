class GetUserWalletsTransactions {
  constructor({ transactionsRepository }) {
    this.transactionsRepo = transactionsRepository;
  }

  async execute(userId, paginationOpts) {
    return await this.transactionsRepo.getUserWalletsTxns(userId, paginationOpts);
  }
}

module.exports = GetUserWalletsTransactions;
