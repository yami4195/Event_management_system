import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_change_in_production";
export const blacklistedTokens = new Set();

export function getToken(req) {
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
    const decoded = jwt.verify(token,JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
}
