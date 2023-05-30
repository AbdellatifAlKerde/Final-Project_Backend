import express from "express";
const router = express.Router();
import controller from "../controllers/userController.js";
import { verifyUserToken } from "../middleware/verifyToken.js";
// import checkUser from "../middleware/check-user.js";

router.get("/", verifyUserToken, controller.getAllUsers);
router.get("/:id", controller.getUserById);
router.put("/:id", controller.editUser);
router.patch("/username/:id", controller.editUsername);
router.patch("/address/:id", controller.editAddress);
router.patch("/phone/:id", controller.editPhone);
router.patch("/email/:id", controller.editEmail);
router.patch("/password/:id", controller.editPassword);

router.post("/register", controller.register);
router.post("/login", controller.login);
router.delete("/:id", controller.deleteUser);

export default router;
