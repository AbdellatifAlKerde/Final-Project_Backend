import express from "express";
const router = express.Router();
import controller from "../controllers/restaurantController.js";
import { uploadImage } from "../middleware/image.js";

router.get("/", controller.getAll);
router.get("/:id", controller.getRestaurantById);

router.put("/:id", uploadImage, controller.editRestaurant);
router.patch("/name/:id", controller.editName);
router.patch("/description/:id", controller.editDescription);
router.patch("/location/:id", controller.editLocation);
router.patch("/image/:id", uploadImage, controller.editImage);

router.post("/", uploadImage, controller.addRestaurant);
router.delete("/:id", controller.deleteRestaurant);

export default router;
