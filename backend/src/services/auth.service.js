import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const register = async (userData) => {
  const { firstname, lastname, email, password, role = "ATTENDEE", phone } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (firstname, lastname, email, password, role, phone)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING user_id, firstname, lastname, email, role, phone, created_at`,
    [firstname, lastname, email.toLowerCase(), hashedPassword, role, phone]
  );

  return result.rows[0];
};

export const findByEmail = async (email) => {
  const result = await pool.query(
    "SELECT user_id, firstname, lastname, email, password, role, phone, created_at FROM users WHERE LOWER(email) = LOWER($1)",
    [email]
  );
  return result.rows[0] || null;
};

export default {
  register,
  findByEmail,
};