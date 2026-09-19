import express from "express";

import {
    protect,
    authorizeRoles
} from "../middleware/authMiddleware.js";

import {
    createCategory,
    deletecategory,
    getCategories,
    updateCategory
} from "../controllers/categoryController.js";

const router = express.Router();

router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    createCategory
);

router.get(
    "/",
    getCategories
)

router.put(
    "/:id",
    protect,
    authorizeRoles("admin"),
    updateCategory
)


router.delete(
    "/:id",
    protect,
    authorizeRoles("admin"),
    deletecategory
)
export default router;