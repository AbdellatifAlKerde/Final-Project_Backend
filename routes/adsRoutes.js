import express from "express";
const router = express.Router();
import controller from "../controllers/adsController.js";
import { uploadImage } from "../middleware/image.js";

router.get("/", controller.getAll);
router.get("/:id", controller.getAdById);
router.put("/:id", uploadImage, controller.editAd);

router.post("/", uploadImage, controller.addAd);
router.delete("/:id", controller.deleteAd);

export default router;
