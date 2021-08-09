const BaseRepo = require("./BaseRepo");
const StateLGAsUploadModel = require("../database/models/StateLGAsUploadModel");

class StateLGAsUploadsRepository extends BaseRepo {
  constructor() {
    super(StateLGAsUploadModel, { singularName: "state lgas upload", pluralName: "stage lgas uploads" });
  }
}

module.exports = StateLGAsUploadsRepository;
