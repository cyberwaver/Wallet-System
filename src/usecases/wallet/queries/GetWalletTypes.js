class GetWalletTypes {
  constructor({ walletTypesRepository }) {
    this.walletTypesRepo = walletTypesRepository;
  }

  async execute(paginationOpts) {
    return await this.walletTypesRepo.getMany(paginationOpts);
  }
}

module.exports = GetWalletTypes;
