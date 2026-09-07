import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_change_in_production";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id || user.user_id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export default generateToken;