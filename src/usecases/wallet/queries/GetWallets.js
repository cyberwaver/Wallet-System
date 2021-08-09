class GetWallets {
  constructor({ walletsRepository }) {
    this.walletsRepo = walletsRepository;
  }

  async execute(paginationOpts) {
    return await this.walletsRepo.getMany(paginationOpts);
  }
}

module.exports = GetWallets;
