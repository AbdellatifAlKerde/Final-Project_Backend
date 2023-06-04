import express from "express";
const router = express.Router();
import controller from "../controllers/orderController.js";

router.get("/", controller.getAllOrder);
router.get("/all", controller.getAllOrders);

router.get("/:id", controller.getOrder);

router.post("/", controller.addOrder);
router.patch("/:id", controller.editOrder);
router.patch("/status/:id", controller.editOrderStatus);
router.delete("/:id", controller.deleteOrder);

export default router;
