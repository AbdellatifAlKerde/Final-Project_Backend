import express from "express";
const router = express.Router();
import controller from "../controllers/factureController.js";

router.get("/", controller.getAllFactures);

router.get("/:id", controller.getFacture);

router.post("/", controller.addFacture);
router.patch("/:id", controller.editFacture);
router.delete("/:id", controller.deleteFacture);

export default router;
