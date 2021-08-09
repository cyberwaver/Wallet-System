const BaseRepo = require("./BaseRepo");
const ApplicationMetaModel = require("../database/models/ApplicationMetaModel");

class ApplicationMetasRepository extends BaseRepo {
  constructor() {
    super(ApplicationMetaModel, { singularName: "application meta", pluralName: "application metas" });
  }
}

module.exports = ApplicationMetasRepository;
