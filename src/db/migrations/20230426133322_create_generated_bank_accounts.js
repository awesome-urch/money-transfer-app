
exports.up = function(knex) {
    return knex.schema.createTable("generated_bank_accounts", function (table) {
        table.increments("id").primary().unsigned();
        table.integer("user_id").unsigned();
        table.string("bank");
        table.string("account_number");
        table.string("account_name");
        table.foreign("user_id").references("users.id");
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable("generated_bank_accounts");
};
