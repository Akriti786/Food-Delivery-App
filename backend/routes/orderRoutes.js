import express from "express";

import {
    protect,
    authorizeRoles
} from "../middleware/authMiddleware.js";

import {
    createOrder,
    getMyOrders,
    getOrderById,
    getRestaurantOrders,
    updateOrderStatusByRestaurant
} from "../controllers/orderController.js";

const router = express.Router();

router.post(
    "/",
    protect,
    authorizeRoles("customer"),
    createOrder
);

router.get(
    "/my",
    protect,
    authorizeRoles("customer"),
    getMyOrders
);

router.get(
    "/restaurant",
    protect,
    authorizeRoles("restaurant"),
    getRestaurantOrders
);

router.patch(
    "/restaurant/:id/status",
    protect,
    authorizeRoles("restaurant"),
    updateOrderStatusByRestaurant
);

router.get(
    "/:id",
    protect,
    authorizeRoles("customer"),
    getOrderById
);

export default router;