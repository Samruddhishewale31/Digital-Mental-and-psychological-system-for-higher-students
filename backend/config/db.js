
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "mindease_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error.message);
});

export const query = (text, params) => {
  return pool.query(text, params);
};

export const testDatabaseConnection = async () => {
  const result = await pool.query(
    "SELECT NOW() AS current_time, current_database() AS database"
  );

  return result.rows[0];
};

export default pool;
