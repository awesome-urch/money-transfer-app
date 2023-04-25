
exports.up = function(knex) {
    return knex.schema.createTable("transactions", function (table) {
        table.increments("id").primary().unsigned();
        table.integer("user_id").unsigned();
        table.decimal("amount");
        table.decimal("balance");
        table.string("transaction_type");
        table.string("transaction_reference");
        table.text("reason");
        table.foreign("user_id").references("Users.id");
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable("transfers");
};
