import express from "express";

import {
    protect,
    authorizeRoles
} from "../middleware/authMiddleware.js";

import {
    addToCart
} from "../controllers/cartController.js";

const router = express.Router();

router.post(
    "/add",
    protect,
    authorizeRoles("customer"),
    addToCart
);

export default router;