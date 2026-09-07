import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import profileRouter from "./routes/profile.routes.js";
import categoryRouter from "./routes/category.routes.js";
import eventRouter from "./routes/event.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import registrationRouter from "./routes/registration.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

import { authenticate, getToken, blacklistedTokens } from "./middlewares/auth.middleware.js";
import { formatUser, signToken, ROLE_TO_DB, ROLE_FROM_DB } from "./controllers/auth.controller.js";

// Re-export core helpers for backwards compatibility
export { authenticate, getToken, blacklistedTokens, formatUser, signToken, ROLE_TO_DB, ROLE_FROM_DB };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/profiles", profileRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/events", eventRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/registrations", registrationRouter);
app.use("/api/dashboard", dashboardRouter);

// Swagger Documentation
let swaggerDocument = YAML.load(path.join(__dirname, "..", "docs", "openapi.yaml"));
if (!swaggerDocument || Object.keys(swaggerDocument).length === 0) {
  swaggerDocument = {
    openapi: "3.0.3",
    info: {
      title: "Event Management API",
      version: "1.0.0",
      description: "API documentation for the Event Management System",
    },
    paths: {},
  };
}
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
