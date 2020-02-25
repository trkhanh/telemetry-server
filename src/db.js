
const { host, user, password, database } = process.env;

const db = require("knex")({
    client: "mysql",
    connection: {
        charset: "utf8mb4",
        host,
        user,
        password,
        database
    }
});

module.exports = db;