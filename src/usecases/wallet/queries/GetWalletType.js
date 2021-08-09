class GetWalletType {
  constructor({ walletTypesRepository }) {
    this.walletTypesRepo = walletTypesRepository;
  }

  async execute(id) {
    return await this.walletTypesRepo.getById(id);
  }
}

module.exports = GetWalletType;
