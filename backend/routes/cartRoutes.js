import express from "express";

import {
    protect,
    authorizeRoles
} from "../middleware/authMiddleware.js";

import {
    addToCart,
    getMyCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../controllers/cartController.js";

const router = express.Router();

router.post(
    "/add",
    protect,
    authorizeRoles("customer"),
    addToCart
);

router.get(
    "/",
    protect,
    authorizeRoles("customer"),
    getMyCart
);

router.put(
    "/item/:menuItemId",
    protect,
    authorizeRoles("customer"),
    updateCartItem
);

router.delete(
    "/item/:menuItemId",
    protect,
    authorizeRoles("customer"),
    removeCartItem
);

router.delete(
    "/clear",
    protect,
    authorizeRoles("customer"),
    clearCart
);

export default router;