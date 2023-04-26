const knex = require("knex");
const { config } = require("./db_config");

const env = process.env.NODE_ENV || "development";
const knexDb = knex(config[env]);

module.exports = {
    knexDb
};