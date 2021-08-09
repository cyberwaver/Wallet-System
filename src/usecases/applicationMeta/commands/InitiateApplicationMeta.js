const metaIDHash = require("../metaIDHash");

const DEFAULT_META_DATA = {
  STAT: {
    data: {
      userCount: 0,
      walletCount: 0,
      walletTypeCount: 0,
      walletBalanceTotal: 0,
      txnVolumeTotal: 0,
    },
    description: "Holds important statistical data",
    name: "Statistics",
    key: "STAT",
  },
};

const META_KEYS = ["STAT"];

class InitiateApplicationMeta {
  constructor({ applicationMetasRepository }) {
    this.applicationMetasRepo = applicationMetasRepository;
  }

  async execute() {
    const metas = [];
    //get metas that have not yet been synced to persistence
    for (let key of META_KEYS) {
      const metaId = metaIDHash[key];
      if (!metaId) continue;
      const metaExists = await this.applicationMetasRepo.recordExistsForId(metaId);
      if (metaExists) continue;
      const metaData = DEFAULT_META_DATA[key];
      metaData.id = metaId;
      metas.push(metaData);
    }
    await this.applicationMetasRepo.addMany(metas);
    //
  }
}

module.exports = InitiateApplicationMeta;
