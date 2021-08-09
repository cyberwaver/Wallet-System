const { Router } = require("express");
const Status = require("http-status");
const BaseController = require("./BaseController");
const router = Router();

class UserController extends BaseController {
  get router() {
    router.get("/:id", this.getUser.bind(this));
    router.get("/", this.getUsers.bind(this));
    router.post("/", this.createUser.bind(this));
    return router;
  }

  async getUsers(req, res) {
    const { getUsers } = req.container.cradle;
    this.task(getUsers, this.extractPaginationOpts(req.query)).execute(res);
  }

  async getUser(req, res) {
    const { getUser, getWalletsByOwnerId, getUserWalletsTransactions } = req.container.cradle;
    this.task(async () => {
      const user = await getUser.execute(req.params.id);
      user.wallets = await getWalletsByOwnerId.execute(user.id);
      user.transactions = await getUserWalletsTransactions.execute(user.id);
      return user;
    }).execute(res);
  }

  async createUser(req, res) {
    const { createUser } = req.container.cradle;
    this.task(createUser, req.body).onSuccess(Status.ACCEPTED, "User created successfully").execute(res);
  }
}

module.exports = UserController;
