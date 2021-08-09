exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.string("id");
      table.increments("cId");
      table.dropPrimary();
      table.primary(["id"]);
      table.string("firstName");
      table.string("lastName");
      table.string("email").unique();
      table.dateTime("createdAt").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
      table.dateTime("updatedAt");
      table.dateTime("deletedAt");
    })
    .createTable("wallets", (table) => {
      table.string("id");
      table.increments("cId");
      table.dropPrimary();
      table.primary(["id"]);
      table.string("typeId");
      table.string("ownerId");
      table.string("balance").defaultTo("0");
      table.dateTime("createdAt").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
      table.dateTime("updatedAt");
      table.dateTime("deletedAt");
    })
    .createTable("wallet_types", (table) => {
      table.string("id");
      table.increments("cId");
      table.dropPrimary();
      table.primary(["id"]);
      table.string("name");
      table.decimal("minBalance", 12, 2).defaultTo(0);
      table.dateTime("createdAt").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
      table.dateTime("updatedAt");
      table.dateTime("deletedAt");
    })
    .createTable("transactions", (table) => {
      table.string("id");
      table.increments("cId");
      table.dropPrimary();
      table.primary(["id"]);
      table.string("type");
      table.string("fromWalletId");
      table.string("toWalletId");
      table.string("amount");
      table.string("status").defaultTo("PENDING");
      table.string("comment");
      table.dateTime("processedAt");
      table.dateTime("createdAt").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
      table.dateTime("updatedAt");
      table.dateTime("deletedAt");
    })
    .createTable("application_metas", (table) => {
      table.string("id");
      table.increments("cId");
      table.dropPrimary();
      table.primary(["id"]);
      table.string("name");
      table.string("key");
      table.string("description");
      table.json("data");
      table.dateTime("createdAt").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
      table.dateTime("updatedAt");
      table.dateTime("deletedAt");
    })
    .createTable("state_lgas_uploads", (table) => {
      table.string("id");
      table.increments("cId");
      table.dropPrimary();
      table.primary(["id"]);
      table.json("data");
      table.dateTime("createdAt").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
      table.dateTime("updatedAt");
      table.dateTime("deletedAt");
    });
};

exports.down = function down(knex) {
  return knex.schema
    .dropTableIfExists("users")
    .dropTableIfExists("wallets")
    .dropTableIfExists("wallet_types")
    .dropTableIfExists("transactions")
    .dropTableIfExists("application_metas")
    .dropTableIfExists("state_lgas_uploads");
};
