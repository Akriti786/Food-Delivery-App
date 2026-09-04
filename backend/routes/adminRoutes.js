import express from "express";

import {
    protect,
    authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();


router.get(
    "/dashboard",
    protect,
    authorizeRoles("admin"),
    (req, res) => {

        res.json({
            message: "Welcome to Admin Dashboard 👑",
            user: req.user
        });

    }
);


export default router;