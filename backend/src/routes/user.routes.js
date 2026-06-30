import { Router } from "express";
import { authenticate } from "../app.js";
import {
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = Router();

// All routes here require authentication
router.use(authenticate);

router.get("/", listUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
