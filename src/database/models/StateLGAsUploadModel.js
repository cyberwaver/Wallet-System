const BaseModel = require("./BaseModel");

class StateLGAsUploadModel extends BaseModel {
  static tableName = "state_lgas_uploads";

  static get jsonAttributes() {
    return ["data"];
  }
}

module.exports = StateLGAsUploadModel;
