const BaseListener = require("./BaseListener");
const { USER_CREATED } = require("../events");

class UserListener extends BaseListener {
  constructor({ updateStatsApplicationMeta }) {
    super();
    this.updateStatsApplicationMeta = updateStatsApplicationMeta;
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    this.listenTo(USER_CREATED, this._updateAppMetaUserCount);
  }

  async _updateAppMetaUserCount() {
    await this.updateStatsApplicationMeta.execute("userCount", "INCREASE");
  }
}

module.exports = UserListener;
