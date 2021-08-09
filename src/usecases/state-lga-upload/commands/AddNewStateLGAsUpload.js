const { STATE_LGAS_UPLOAD_ADDED } = require("../../../event/events");

class AddNewStateLGAsUpload {
  constructor({ stateLGAsUploadsRepository, eventPublisher }) {
    this.stateLGAsUploadsRepo = stateLGAsUploadsRepository;
    this.eventPublisher = eventPublisher;
  }

  async execute(requestData = []) {
    const list = this._formatDataStructure(requestData);
    const upload = await this.stateLGAsUploadsRepo.add({ data: list });
    this.eventPublisher.publish(STATE_LGAS_UPLOAD_ADDED, upload);
    return upload;
  }

  _formatDataStructure(dataList) {
    let keyIndexMap = new Map();
    const list = [];
    for (const { state, lga } of dataList) {
      const key = String(state).toLowerCase().replace(" ", "");
      let index = keyIndexMap.get(key);
      if (!index) {
        //lgas map for state does not exist yet
        index = list.length;
        list.push({});
        keyIndexMap.set(key, index);
      }
      list[index] = { state, lgas: [...(list[index].lgas || []), lga] };
    }
    return list;
  }
}

module.exports = AddNewStateLGAsUpload;
