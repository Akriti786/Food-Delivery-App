import express from "express";

import {
    getAllRestaurantsAdmin,
    approveRestaurant,
    rejectRestaurant,
    updateRestaurantStatusAdmin
} from "../controllers/adminRestaurantController.js";

import {
    protect,
    authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();


// Get all restaurants
router.get(
    "/",
    protect,
    authorizeRoles("admin"),
    getAllRestaurantsAdmin
);


// Approve restaurant
router.patch(
    "/:id/approve",
    protect,
    authorizeRoles("admin"),
    approveRestaurant
);


// Reject restaurant
router.patch(
    "/:id/reject",
    protect,
    authorizeRoles("admin"),
    rejectRestaurant
);


// Open / close restaurant
router.patch(
    "/:id/status",
    protect,
    authorizeRoles("admin"),
    updateRestaurantStatusAdmin
);

export default router;