const pool = require("../config/db");
const bcrypt = require("bcrypt");

const register = async (email, password) => {

    const existingUser = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users(email, password)
         VALUES($1, $2)
         RETURNING user_id, email`,
        [email, hashedPassword]
    );

    return result.rows[0];
};

module.exports = {
    register
};