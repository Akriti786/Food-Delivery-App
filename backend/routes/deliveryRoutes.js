import express from "express";

import {
    createDeliveryPartner,
    getReadyOrders,
    getMyOrders,
    assignOrder,
    updateDeliveryOrderStatus
} from "../controllers/deliveryController.js";

import {
    protect,
    authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();


// Admin creates delivery partner
router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    createDeliveryPartner
);


// Delivery partner sees available READY orders
router.get(
    "/ready-orders",
    protect,
    authorizeRoles("delivery"),
    getReadyOrders
);


// Delivery partner sees orders assigned to them
router.get(
    "/my-orders",
    protect,
    authorizeRoles("delivery"),
    getMyOrders
);


// Delivery partner assigns an order
router.patch(
    "/assign/:orderId",
    protect,
    authorizeRoles("delivery"),
    assignOrder
);


// Delivery partner updates delivery status
router.patch(
    "/order/:orderId/status",
    protect,
    authorizeRoles("delivery"),
    updateDeliveryOrderStatus
);


export default router;