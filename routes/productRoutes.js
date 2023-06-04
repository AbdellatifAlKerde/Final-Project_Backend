import express from "express";
const router = express.Router();
import controller from "../controllers/productController.js";
import { uploadImage } from "../middleware/image.js";

router.get("/", controller.getAll);
router.get("/all", controller.getAllProducts);
router.get("/:id", controller.getProduct);
router.get("/category/:categoryId", controller.getProductByCategory);
router.post("/", controller.addProduct);
router.put("/:id", controller.editProduct);
router.delete("/:id", controller.deleteProduct);

export default router;
