"use strict";

const Knex = require("knex");
const configuration = require("./src/config/db_config").config;

const config = configuration;

module.exports = configuration;
exports.config = config;

