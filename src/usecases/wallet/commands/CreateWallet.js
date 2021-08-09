const { WALLET_CREATED } = require("../../../event/events");

class CreateWallet {
  constructor({ walletValidator, walletsRepository, eventPublisher }) {
    this.walletValidator = walletValidator;
    this.walletsRepo = walletsRepository;
    this.eventPublisher = eventPublisher;
  }

  async execute(requestData) {
    const data = await this.walletValidator.validateNewWalletData(requestData);
    const wallet = await this.walletsRepo.add(data);
    this.eventPublisher.publish(WALLET_CREATED, wallet);
    return wallet;
  }
}

module.exports = CreateWallet;
