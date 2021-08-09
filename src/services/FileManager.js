const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");
const excelToJSON = require("convert-excel-to-json");

class FileManager {
  constructor({ config }) {
    this.config = config;
  }

  async getFileContent(filePath) {
    return await new Promise((resolve, reject) => {
      fs.readFile(path.join(this.config.rootPath, filePath), "utf-8", (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  async convertXLSXFiletoJSON(filePath, columnToKeyHash) {
    const sheetJSON = excelToJSON({
      sourceFile: path.join(this.config.rootPath, filePath),
      header: {
        rows: 1,
      },
      columnToKey: columnToKeyHash,
    });

    return sheetJSON;
  }
}

module.exports = FileManager;
