import express from "express";

import {
    protect,
    authorizeRoles
} from "../middleware/authMiddleware.js";

import {
    createDeliveryPartner,
    getReadyOrders,
    assignOrder,
    updateDeliveryOrderStatus
} from "../controllers/deliveryController.js";
const router = express.Router();

// ADMIN - CREATE DELIVERY PARTNER
router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    createDeliveryPartner
);

// DELIVERY - VIEW READY ORDERS
router.get(
    "/ready-orders",
    protect,
    authorizeRoles("delivery"),
    getReadyOrders
);

// DELIVERY - ASSIGN ORDER TO MYSELF
router.patch(
    "/assign/:orderId",
    protect,
    authorizeRoles("delivery"),
    assignOrder
);

router.patch(
    "/order/:orderId/status",
    protect,
    authorizeRoles("delivery"),
    updateDeliveryOrderStatus
);

export default router;