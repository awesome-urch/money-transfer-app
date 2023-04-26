
exports.up = function(knex) {
    return knex.schema.alterTable("wallets", (table) => {
        table.decimal("balance")
          .defaultTo(0.00)
          .alter();
      });
};

exports.down = function(knex) {
    return knex.schema.createTable("wallets", function (table) {
        table.increments("id").primary().unsigned();
        table.integer("user_id").unsigned();
        table.string("transaction_type");
        table.decimal("balance").defaultTo(0.00);
        table.foreign("user_id").references("users.id");
      });
};
