import "dotenv/config";
import bcrypt from "bcrypt";
import pool from "./src/config/db.js";

async function resetAdmin() {
  const email = process.argv[2] || "admin@eventflow.com";
  const password = process.argv[3] || "Admin@12345";

  try {
    console.log(`\n========================================`);
    console.log(`🔐 Resetting Admin Account Credentials`);
    console.log(`========================================`);
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin user with this email or role exists
    const checkUser = await pool.query(
      "SELECT user_id, email, role FROM users WHERE LOWER(email) = LOWER($1)",
      [email]
    );

    if (checkUser.rows.length > 0) {
      // Update password and ensure role is ADMIN
      await pool.query(
        "UPDATE users SET password = $1, role = 'ADMIN' WHERE user_id = $2",
        [hashedPassword, checkUser.rows[0].user_id]
      );
      console.log(`\n✅ Success: Updated password for existing user: ${email}`);
    } else {
      // Insert new admin user
      const result = await pool.query(
        `INSERT INTO users (firstname, lastname, email, password, role, phone)
         VALUES ($1, $2, $3, $4, 'ADMIN', $5)
         RETURNING user_id, email, role`,
        ["System", "Admin", email.toLowerCase(), hashedPassword, "+251912345678"]
      );
      console.log(`\n✅ Success: Created new admin user: ${email} (ID: ${result.rows[0].user_id})`);
    }

    console.log(`========================================`);
    console.log(`You can now log in at http://localhost:5173/login with:`);
    console.log(`  • Email:    ${email}`);
    console.log(`  • Password: ${password}`);
    console.log(`========================================\n`);
  } catch (error) {
    console.error("\n❌ Error resetting admin:", error.message);
  } finally {
    await pool.end();
  }
}

resetAdmin();
