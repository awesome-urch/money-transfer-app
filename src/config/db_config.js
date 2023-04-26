const dotenv = require("dotenv");
dotenv.config();

const config = {
  development: {
    client: "mysql",
    connection: {
      database: process.env.DATABASE_NAME,
      user:     process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "src/db/migrations",
    },
    seeds: {
      directory: "src/db/seeds",
    }
  },
  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user:     "username",
      password: "password"
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },
  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user:     "username",
      password: "password"
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
};

module.exports = { config };


