const { STATS_APPLICATION_META_UPDATED } = require("../../../event/events");
const { ApplicationException } = require("../../../exceptions");
const metaIDHash = require("../metaIDHash");

class UpdateStatsApplicationMeta {
  constructor({ applicationMetasRepository, eventPublisher }) {
    this.applicationMetasRepo = applicationMetasRepository;
    this.eventPublisher = eventPublisher;
  }

  async execute(key, operationType, operationValue = 1) {
    const statMeta = await this.applicationMetasRepo.getById(metaIDHash.STAT);
    const handler = this._getOperationHandler(operationType);
    const value = handler(statMeta.data, key, operationValue);

    const data = { ...statMeta.data, [key]: value };
    const updatedMeta = await this.applicationMetasRepo.updateById(metaIDHash.STAT, { data });
    // this.eventPublisher.publish(STATS_APPLICATION_META_UPDATED, updatedMeta);
    return updatedMeta;
  }

  _getOperationHandler(type) {
    const typeHandlerMap = {
      INCREASE: this._handle__INCREASE,
      DECREASE: this._handle__DECREASE,
      INC: this._handle__INCREASE,
      DEC: this._handle__DECREASE,
    };
    const handler = typeHandlerMap[type];
    if (handler) return handler;
    throw new ApplicationException("UpdateStatsApplicationMeta: operation handler not found");
  }

  _handle__INCREASE(metaData, key, value) {
    return Number(metaData[key]) + Number(value);
  }
  _handle__DECREASE(metaData, key, value) {
    return Number(metaData[key]) - Number(value);
  }
}

module.exports = UpdateStatsApplicationMeta;
