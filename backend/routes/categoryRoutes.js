import express from "express";

import {
    protect,
    authorizeRoles
} from "../middleware/authMiddleware.js";

import {
    createCategory
} from "../controllers/categoryController.js";

const router = express.Router();

router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    createCategory
);

export default router;