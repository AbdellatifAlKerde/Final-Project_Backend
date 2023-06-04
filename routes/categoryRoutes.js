import express from "express";
const router = express.Router();
import { uploadImage } from "../middleware/image.js";
import controller from "../controllers/categoryController.js";

router.get("/", controller.getAll);
router.get("/all", controller.getAllCategories);
router.post("/", controller.createCategory);
router.delete("/:id", controller.deleteCategoryById);
router.get("/:id", controller.getCategoryById);
router.put("/:id", controller.updateCategoryById);
export default router;
