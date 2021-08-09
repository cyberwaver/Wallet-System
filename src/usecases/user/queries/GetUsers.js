class GetUsers {
  constructor({ usersRepository }) {
    this.usersRepo = usersRepository;
  }

  async execute(paginationOpts) {
    return await this.usersRepo.getMany(paginationOpts);
  }
}

module.exports = GetUsers;
