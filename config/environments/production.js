module.exports = {
  web: {
    PORT: process.env.PORT,
  },
  logging: {
    appenders: {
      out: { type: "console" },
    },
    categories: {
      default: { appenders: ["out"], level: "info" },
    },
  },
};
