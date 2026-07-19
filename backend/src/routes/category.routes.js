import { Router } from "express";
import { authenticate } from "../app.js";
import {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = Router();

// Public read access for event browsing and forms
router.get("/", listCategories);
router.get("/:id", getCategoryById);

router.post("/", authenticate, createCategory);
router.put("/:id", authenticate, updateCategory);
router.delete("/:id", authenticate, deleteCategory);

export default router;
