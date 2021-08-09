class GetWalletTransactions {
  constructor({ transactionsRepository }) {
    this.transactionsRepo = transactionsRepository;
  }

  async execute(walletId, paginationOpts) {
    return await this.transactionsRepo.getWalletTxns(walletId, paginationOpts);
  }
}

module.exports = GetWalletTransactions;
