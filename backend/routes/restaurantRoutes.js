import express from "express";

import {
    protect,
    authorizeRoles
} from "../middleware/authMiddleware.js";

import {
    createRestaurant,
    getMyRestaurant,
    updateMyRestaurant
} from "../controllers/restaurantController.js";

const router = express.Router();


// CREATE RESTAURANT
router.post(
    "/",
    protect,
    authorizeRoles("restaurant"),
    createRestaurant
);


// GET MY RESTAURANT
router.get(
    "/my",
    protect,
    authorizeRoles("restaurant"),
    getMyRestaurant
);


// UPDATE MY RESTAURANT
router.put(
    "/my",
    protect,
    authorizeRoles("restaurant"),
    updateMyRestaurant
);


export default router;