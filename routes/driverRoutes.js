import express from "express";
const router = express.Router();
import controller from "../controllers/driverController.js";
// import checkUser from "../middleware/check-user.js";

router.get("/", controller.getAll);
router.get("/:id", controller.getDriverById);
router.put("/:id", controller.editDriver);

router.post("/", controller.addDriver);
router.delete("/:id", controller.deleteDriver);

export default router;
