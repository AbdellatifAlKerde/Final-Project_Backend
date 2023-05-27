import express from "express";
const router = express.Router();
import controller from "../controllers/cartController.js";

router.get("/:id", controller.getCartItems);
// router.get("/:id", controller.getAdById);
// router.put("/:id", uploadImage, controller.editAd);

router.post("/", controller.addToCart);
// router.delete("/:id", controller.deleteAd);

export default router;
