import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { DB_USER, DB_HOST, DB_NAME, DB_PASS, DB_PORT } = process.env;
const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASS,
    port: DB_PORT,
    ssl: true
});

export default pool;