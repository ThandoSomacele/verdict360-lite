import pkg from "knex";
const { knex } = pkg;
const config = {
  client: "postgresql",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER || "verdict360_user",
    password: process.env.DB_PASSWORD || "verdict360_password",
    database: process.env.DB_NAME || "verdict360_dev"
  },
  migrations: {
    directory: "./src/database/migrations",
    tableName: "knex_migrations"
  },
  seeds: {
    directory: "./src/database/seeds"
  },
  pool: {
    min: 2,
    max: 10
  }
};
const db = knex(config);
export {
  db as d
};
