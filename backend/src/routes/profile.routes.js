import { Router } from "express";
import { authenticate } from "../app.js";
import {
  listProfiles,
  getProfileByUserId,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/profile.controller.js";

const router = Router();

// Protect all profile endpoints
router.use(authenticate);

router.get("/", listProfiles);
router.post("/", createProfile);
router.get("/:id", getProfileByUserId);
router.put("/:id", updateProfile);
router.delete("/:id", deleteProfile);

export default router;
