import express from "express";
const router = express.Router();
import controller from "../controllers/userController.js";
import { verifyUserToken } from "../middleware/verifyToken.js";
// import checkUser from "../middleware/check-user.js";

router.get("/", verifyUserToken, controller.getAllUsers);
router.get("/:id", controller.getUserById);
router.put("/:id", controller.editUser);
router.patch("/:id", controller.editUser);

router.post("/register", controller.register);
router.post("/login", controller.login);
router.delete("/:id", controller.deleteUser);

export default router;
