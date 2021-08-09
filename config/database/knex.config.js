const path = require("path");

const baseConfig = {
  client: "pg",
  useNullAsDefault: true,
  connection: {
    connectionString: process.env.DB__URL,
    host: process.env.DB__HOST,
    user: process.env.DB__USER,
    password: process.env.DB__PASSWORD,
    dbName: process.env.DB__NAME,
    ssl: { rejectUnauthorized: false },
  },
  pool: {
    // afterCreate: (conn, cb) => {
    //   conn.run("PRAGMA foreign_keys = ON", cb);
    // },
  },
  migrations: {
    directory: path.join(__dirname, "../../src/database/migrations"),
    tableName: "knexMigrations",
  },
  seeds: {
    directory: path.join(__dirname, "../../src/database/seeds"),
    tableName: "knexSeeds",
  },
};

module.exports = {
  production: baseConfig,
  test: {
    ...baseConfig,
    connection: {
      host: "localhost",
      user: "mmguser",
      password: "123456",
      database: "mmg-test-test",
    },
  },
  development: {
    ...baseConfig,
    connection: {
      host: "localhost",
      user: "mmguser",
      password: "123456",
      database: "mmg-test",
    },
  },
};
