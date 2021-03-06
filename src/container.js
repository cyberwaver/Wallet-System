const { createContainer, asClass, asFunction, asValue, Lifetime } = require("awilix");
const _ = require("lodash");
const config = require("../config/config.index");
const Application = require("./Application");
const logger = require("./logging/logger");
const registerListeners = require("./event/registerListeners");
const server = require("./interfaces/http/server.loader");
const container = createContainer();

// System
container
  .register({
    app: asClass(Application).singleton(),
    server: asFunction(server).singleton(),
  })
  .register({
    logger: asFunction(logger).singleton(),
  })
  .register({
    config: asValue(config),
    container: asValue(container),
  })
  .register({
    registerListeners: asFunction(registerListeners).singleton(),
  });

//usecases
container.loadModules(["src/usecases/*/!(rules)/*.js"], {
  formatName: (g) => {
    const firstLetter = g.substr(0, 1).toLowerCase();
    return `${firstLetter}${g.substr(1)}`;
  },
  resolverOptions: {
    lifetime: Lifetime.SINGLETON,
    register: asClass,
  },
});

//Load services as scoped per request
container.loadModules(["src/services/*.js"], {
  formatName: "camelCase",
  resolverOptions: {
    lifetime: Lifetime.SINGLETON,
    register: asClass,
  },
});

//Load Repositories as singleton
container.loadModules(["src/repositories/**/*.js"], {
  formatName: _.lowerFirst,
  resolverOptions: {
    lifetime: Lifetime.SINGLETON,
    register: asClass,
  },
});

//Load Modules as singleton
container.loadModules(["src/modules/**/*.js"], {
  formatName: "camelCase",
  resolverOptions: {
    lifetime: Lifetime.SINGLETON,
    register: asClass,
  },
});

//Load Validators as singleton
container.loadModules(["src/validators/**/*.js"], {
  formatName: "camelCase",
  resolverOptions: {
    lifetime: Lifetime.SINGLETON,
    register: asClass,
  },
});

module.exports = container;
