const path = require('path');
const envPath = path.resolve(__dirname, '../../.env');
require('dotenv').config({path: envPath});

const pgp = require('pg-promise')();

const cn = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
}

const PgDb = pgp(cn);

module.exports = PgDb;