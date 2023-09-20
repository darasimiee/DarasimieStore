import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getAllOrdersByAdmin,
  createOrder,
  getUserOrders,
  getOrderDetail,
  trackOrders,
} from "../controllers/order.js";

const router = express.Router();

router.get("/", verifyToken, getAllOrdersByAdmin);

router.get("/user", verifyToken, getUserOrders);

router.post("/createorder", verifyToken, createOrder);

// get

router.get("/:id", verifyToken, getOrderDetail);

//put
router.put("/:id/tracking", verifyToken, trackOrders);

export default router;
