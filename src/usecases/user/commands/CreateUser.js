const { USER_CREATED } = require("../../../event/events");

class CreateUser {
  constructor({ usersRepository, userValidator, eventPublisher }) {
    this.usersRepo = usersRepository;
    this.userValidator = userValidator;
    this.eventPublisher = eventPublisher;
  }

  async execute(requestData) {
    const data = await this.userValidator.validateNewUserData(requestData);
    const user = await this.usersRepo.add(data);
    this.eventPublisher.publish(USER_CREATED, user);
    return user;
  }
}

module.exports = CreateUser;
