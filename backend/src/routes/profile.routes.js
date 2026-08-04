import { Router } from "express";
import { authenticate } from "../app.js";
import upload from "../middlewares/upload.js";
import {
  listProfiles,
  getProfileByUserId,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/profile.controller.js";

function handleUpload(fieldName) {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Invalid image upload.",
        });
      }
      next();
    });
  };
}

const router = Router();

// Protect all profile endpoints
router.use(authenticate);

router.get("/", listProfiles);
router.post("/", handleUpload("image"), createProfile);
router.get("/:id", getProfileByUserId);
router.put("/:id", handleUpload("image"), updateProfile);
router.delete("/:id", deleteProfile);

export default router;
