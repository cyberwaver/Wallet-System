const { WALLET_TYPE_CREATED } = require("../../../event/events");

class CreateWalletType {
  constructor({ walletValidator, walletTypesRepository, eventPublisher }) {
    this.walletValidator = walletValidator;
    this.walletTypesRepo = walletTypesRepository;
    this.eventPublisher = eventPublisher;
  }

  async execute(requestData) {
    const data = await this.walletValidator.validateNewWalletTypeData(requestData);
    const wallet = await this.walletTypesRepo.add(data);
    this.eventPublisher.publish(WALLET_TYPE_CREATED, wallet);
    return wallet;
  }
}

module.exports = CreateWalletType;
