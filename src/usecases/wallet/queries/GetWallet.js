class GetWallet {
  constructor({ walletsRepository }) {
    this.walletsRepo = walletsRepository;
  }

  async execute(id) {
    return await this.walletsRepo.getById(id);
  }
}

module.exports = GetWallet;
