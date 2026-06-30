import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "event_management_system",
  password: process.env.DB_PASSWORD || "42132130",
  port: Number(process.env.DB_PORT) || 5432,
});

pool
  .connect()
  .then(() => console.log("PostgreSQL connected successfully"))
  .catch((err) => console.log("Connection failed:", err.message));

export default pool;
