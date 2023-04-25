
exports.up = function(knex) {
    return knex.schema.createTable("transfers", function (table) {
        table.increments("id").primary().unsigned();
        table.integer("user_id").unsigned();
        table.integer("receiver_bank_account").unsigned();
        table.decimal("amount");
        table.foreign("user_id").references("Users.id");
        table.foreign("receiver_bank_account").references("bank_accounts.id");
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable("transfers");
};
