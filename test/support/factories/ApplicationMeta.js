module.exports = (factory, { ApplicationMetaModel }) => {
  factory.define("ApplicationMeta", ApplicationMetaModel, {
    id: factory.chance("guid"),
    name: factory.chance("name"),
    key: "KEY",
    description: "",
    data: {},
  });
};
