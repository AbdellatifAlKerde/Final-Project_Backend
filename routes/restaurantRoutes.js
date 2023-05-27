import express from "express";
const router = express.Router();
import controller from "../controllers/restaurantController.js";
import { uploadImage } from "../middleware/image.js";

router.get("/", controller.getAll);
router.get("/:id", controller.getRestaurantById);

router.put("/:id", uploadImage, controller.editRestaurant);

router.post("/", uploadImage, controller.addRestaurant);
router.delete("/:id", controller.deleteRestaurant);

export default router;
