
exports.up = function(knex) {
    return knex.schema.createTable("wallets", function (table) {
        table.increments("id").primary().unsigned();
        table.integer("user_id").unsigned();
        table.string("transaction_type");
        table.decimal("balance");
        table.foreign("user_id").references("users.id");
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable("wallets");
};
