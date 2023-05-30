import express from "express";
const router = express.Router();
import controller from "../controllers/adminController.js";
import { verifyAdminToken } from "../middleware/verifyToken.js";

router.get("/", verifyAdminToken, controller.getAllAdmins);
router.get("/:id", controller.getAdminById);
router.put("/:id", controller.editAdmin);
router.patch("/username/:id", controller.editUsername);
router.patch("/password/:id", controller.editPassword);

router.post("/register", controller.register);
router.post("/login", controller.login);
router.delete("/:id", controller.deleteAdmin);

export default router;
