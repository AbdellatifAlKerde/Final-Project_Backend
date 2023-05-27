import express from "express";
const router = express.Router();
import controller from "../controllers/productController.js";
import { uploadImage } from "../middleware/image.js";

router.get("/", controller.getAllProducts);
router.get("/:id", controller.getProduct);
router.get("/category/:category", controller.getProductByCategory);
router.post("/", uploadImage, controller.addProduct);
router.put("/:id", uploadImage, controller.editProduct);
router.delete("/:id", controller.deleteProduct);

export default router;
