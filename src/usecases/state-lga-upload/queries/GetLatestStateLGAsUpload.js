class GetLatestStateLGAsUpload {
  constructor({ stateLGAsUploadsRepository }) {
    this.stateLGAsUploadsRepo = stateLGAsUploadsRepository;
  }

  async execute() {
    return await this.stateLGAsUploadsRepo.getLatestEntry();
  }
}

module.exports = GetLatestStateLGAsUpload;
