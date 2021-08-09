const BaseRepo = require("./BaseRepo");
const UserModel = require("../database/models/UserModel");

class UsersRepository extends BaseRepo {
  constructor() {
    super(UserModel, { singularName: "user", pluralName: "users" });
  }
}

module.exports = UsersRepository;
