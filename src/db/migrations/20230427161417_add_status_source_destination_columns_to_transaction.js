
exports.up = function(knex) {
    return knex.schema.alterTable("transactions", (table) => {
        table.string("status");
        table.integer("source");
        table.integer("destination");
      });
};

exports.down = function(knex) {
    return knex.schema.createTable("transactions", function (table) {
        table.increments("id").primary().unsigned();
        table.integer("user_id").unsigned();
        table.decimal("amount");
        table.decimal("balance");
        table.string("transaction_type");
        table.string("transaction_reference");
        table.text("reason");
        table.string("status");
        table.integer("source");
        table.integer("destination");
        table.foreign("user_id").references("users.id");
      });
};
