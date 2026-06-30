import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "./config/db.js";
import userRouter from "./routes/user.routes.js";
import profileRouter from "./routes/profile.routes.js";
import categoryRouter from "./routes/category.routes.js";
import eventRouter from "./routes/event.routes.js";

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_change_in_production";
const blacklistedTokens = new Set();

export const ROLE_TO_DB = { CUSTOMER: "ATTENDEE", ORGANIZER: "ORGANIZER", ADMIN: "ADMIN" };
export const ROLE_FROM_DB = { ATTENDEE: "CUSTOMER", ORGANIZER: "ORGANIZER", ADMIN: "ADMIN" };

app.use(cors());
app.use(express.json());

export function formatUser(row) {
  const [firstname, ...rest] = row.name?.trim().split(/\s+/) || [];
  return {
    id: row.user_id,
    firstname: firstname || "",
    lastname: rest.join(" ") || "",
    email: row.email,
    role: ROLE_FROM_DB[row.role] || row.role,
    phone: row.phone,
    createdAt: row.created_at,
  };
}

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

function getToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  if (req.body?.token) {
    return req.body.token.trim();
  }
  return null;
}

export function authenticate(req, res, next) {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ success: false, message: "Token has been revoked." });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    req.token = token;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
}

app.post("/api/auth/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password, role = "CUSTOMER" } = req.body;

    if (!firstname?.trim() || !lastname?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }

    const normalizedRole = role.toUpperCase();
    if (!ROLE_TO_DB[normalizedRole]) {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await pool.query("SELECT user_id FROM users WHERE email = $1", [normalizedEmail]);

    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id, name, email, role, phone, created_at`,
      [`${firstname.trim()} ${lastname.trim()}`, normalizedEmail, passwordHash, ROLE_TO_DB[normalizedRole]]
    );

    const user = formatUser(result.rows[0]);
    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      data: { user, token: signToken(user) },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ success: false, message: "Registration failed." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const result = await pool.query(
      "SELECT user_id, name, email, password, role, phone, created_at FROM users WHERE email = $1",
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0 || !(await bcrypt.compare(password, result.rows[0].password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const user = formatUser(result.rows[0]);
    return res.json({
      success: true,
      message: "Login successful.",
      data: { user, token: signToken(user) },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ success: false, message: "Login failed." });
  }
});

app.post("/api/auth/logout", (req, res) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ success: false, message: "Token has been revoked." });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    blacklistedTokens.add(token);
    return res.json({ success: true, message: "Logout successful." });
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
});

app.get("/api/auth/me", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT user_id, name, email, role, phone, created_at FROM users WHERE user_id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.json({ success: true, data: { user: formatUser(result.rows[0]) } });
  } catch (error) {
    console.error("Profile error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch profile." });
  }
});
console.log("Logout route loaded");

app.use("/api/users", userRouter);
app.use("/api/profiles", profileRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/events", eventRouter);

export default app;
