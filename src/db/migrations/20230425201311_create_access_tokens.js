
exports.up = function(knex) {
    return knex.schema.createTable("access_tokens", function (table) {
        table.increments("id").primary().unsigned();
        table.integer("user_id").unsigned();
        table.string("access_token");
        table.timestamp("access_token_expires");
        table.foreign("user_id").references("Users.id");
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable("access_tokens");
};
