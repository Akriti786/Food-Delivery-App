import Category from "../models/Category.js";

//CREATE CATEGORY
export const createCategory = async (req, res) => {
    try {

        const { name, image } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(400).json({
                message: "Category already exist"
            });
        }

        //CREATE CATEGORY
        const category = await Category.create({
            name,
            image: image || ""
        });

        res.status(201).json({
            message: "Category created successfully",
            category
        });
    } catch (error) {
        console.error("Create category error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};