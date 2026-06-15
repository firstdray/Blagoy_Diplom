require('dotenv').config();
const pgp = require('pg-promise')();

const cn = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
}

const pgDb = pgp(cn);

async function runMigrate() {
    try {
        await pgDb.query(`
            CREATE TABLE IF NOT EXISTS companies (
                id SERIAL PRIMARY KEY,
                company_name VARCHAR(255) NOT NULL,
                company_site VARCHAR(255) NOT NULL,
                company_description VARCHAR(255) NOT NULL,
                director VARCHAR(255) NOT NULL,
                type_coop VARCHAR(255) NOT NULL,
                specialization VARCHAR(255) NOT NULL,
                path_logo VARCHAR(255) NOT NULL
            );
        `);
        console.log('Table companies successfully created/found');

        await pgDb.query(`
            CREATE TABLE IF NOT EXISTS "session" (
                "sid" varchar(255) NOT NULL COLLATE "default",
                "sess" json NOT NULL,
                "expire" timestamp(6) NOT NULL,
                CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
            );
        `);
        console.log('Table session successfully created/found');

        await pgDb.query(`
            CREATE INDEX IF NOT EXISTS "session_expire_idx" ON "session" ("expire");
        `);
        console.log('Session expire index created/found');
    } catch (error) {
        console.error("Failed Migrate", error);
        process.exit(1)
    } finally {
        pgp.end()
    }
}

runMigrate();