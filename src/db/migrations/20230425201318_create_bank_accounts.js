
exports.up = function(knex) {
    return knex.schema.createTable("bank_accounts", function (table) {
        table.increments("id").primary().unsigned();
        table.string("bank");
        table.string("bank_code");
        table.string("account_number");
        table.string("account_name");
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable("bank_accounts");
};
