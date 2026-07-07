import { Router } from "express";
import { authenticate } from "../app.js";
import {
  createRegistration,
  listAllRegistrations,
  getMyRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
} from "../controllers/registration.controller.js";

const router = Router();

// All registration routes require authentication
router.use(authenticate);

router.post("/", createRegistration);
router.get("/", listAllRegistrations);
router.get("/my", getMyRegistrations);
router.patch("/:id/status", updateRegistrationStatus);
router.delete("/:id", deleteRegistration);

export default router;
