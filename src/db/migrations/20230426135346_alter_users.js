
exports.up = function(knex) {
    return knex.schema.alterTable("users", (table) => {
        table.string("first_name");
        table.string("last_name");
        table.string("phone");
      });
};

exports.down = function(knex) {
    return knex.schema.createTable("users", function (table) {
        table.increments("id").primary().unsigned();
        table.string("username").unique().index();
        table.string("password");
        table.string("email").unique().index();
        table.string("first_name");
        table.string("last_name");
        table.string("phone");
      });
};
