
exports.up = function(knex) {
    return knex.schema.createTable("users", function (table) {
        table.increments("id").primary().unsigned();
        table.string("username").unique().index();
        table.string("password");
        table.string("email").unique().index();
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable("users");
};
