const metaIDHash = require("../metaIDHash");

class GetStatsApplicationMeta {
  constructor({ applicationMetasRepository }) {
    this.applicationMetasRepo = applicationMetasRepository;
  }

  async execute() {
    return await this.applicationMetasRepo.getById(metaIDHash.STAT);
  }
}

module.exports = GetStatsApplicationMeta;
