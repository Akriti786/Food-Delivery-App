import express from "express";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { createMenuItem } from "../controllers/menuItemController.js";

const router = express.Router();

router.post(
    "/",
    protect,
    authorizeRoles("restaurant"),
    createMenuItem
);

export default router;

