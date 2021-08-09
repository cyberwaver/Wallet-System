const BaseModel = require("./BaseModel");

class ApplicationMetaModel extends BaseModel {
  static tableName = "application_metas";

  static get jsonAttributes() {
    return ["data"];
  }

  static get relationMappings() {}
}

module.exports = ApplicationMetaModel;
