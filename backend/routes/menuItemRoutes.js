import express from "express";

import {
    protect,
    authorizeRoles
} from "../middleware/authMiddleware.js";

import {
    createMenuItem,
    deleteMenuItem,
    getMyMenuItems,
    updateMenuItem
} from "../controllers/menuItemController.js";

const router = express.Router();

router.post(
    "/",
    protect,
    authorizeRoles("restaurant"),
    createMenuItem
);

router.get(
    "/my",
    protect,
    authorizeRoles("restaurant"),
    getMyMenuItems
)


router.put(
    "/:id",
    protect,
    authorizeRoles("restaurant"),
    updateMenuItem
)

router.delete(
    "/:id",
    protect,
    authorizeRoles("restaurant"),
    deleteMenuItem
)


export default router;