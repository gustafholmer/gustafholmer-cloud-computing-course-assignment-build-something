import { Pool } from "pg";
import fs from 'fs';
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

async function initializeDatabase() {
  try {
    const schema = fs.readFileSync('/usr/src/app/init.sql', 'utf8');
    await pool.query(schema);
    console.log('Database schema applied successfully.');
  } catch (err) {
    console.error('Error applying database schema:', err);
  }
}

initializeDatabase();

export default pool;
