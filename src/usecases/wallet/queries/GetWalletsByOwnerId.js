class GetWalletsByOwnerId {
  constructor({ walletsRepository }) {
    this.walletsRepo = walletsRepository;
  }

  async execute(ownerId, paginationOpts) {
    return await this.walletsRepo.getManyByAttributes({ ownerId }, paginationOpts);
  }
}

module.exports = GetWalletsByOwnerId;
