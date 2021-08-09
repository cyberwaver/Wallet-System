const { Router } = require("express");
const Status = require("http-status");
const BaseController = require("./BaseController");
const router = Router();

class MiscController extends BaseController {
  get router() {
    router.get("/stats", this.getStats.bind(this));
    router.get("/state-lga/view", this.viewLatestStateLGAUpload.bind(this));
    router.post("/state-lga/import", this.importStateLGAExcelSheet.bind(this));
    return router;
  }

  getStats(req, res) {
    const { getStatsApplicationMeta } = req.container.cradle;
    this.task(async () => {
      const meta = await getStatsApplicationMeta.execute();
      return meta.data;
    }).execute(res);
  }

  viewLatestStateLGAUpload(req, res) {
    const { getLatestStateLGAsUpload } = req.container.cradle;
    this.task(async () => {
      const stateLGAsUpload = await getLatestStateLGAsUpload.execute();
      if (!stateLGAsUpload) return [];
      return stateLGAsUpload.data.reduce((acc, { state, lgas }) => ({ ...acc, [state]: lgas }), {});
    }).execute(res);
  }

  importStateLGAExcelSheet(req, res) {
    const { fileManager, addNewStateLGAsUpload } = req.container.cradle;
    this.task(async () => {
      const stateLGAsJSON = await fileManager.convertXLSXFiletoJSON("/assets/state_lga.xlsx", {
        A: "lga",
        B: "state",
      });
      await addNewStateLGAsUpload.execute(stateLGAsJSON.Sheet1);
    })
      .onSuccess(Status.ACCEPTED, "State LGA Excel sheet imported successfully")
      .execute(res);
  }
}

module.exports = MiscController;
