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



//GET CATEGORY 
export const getCategories = async (req, res) => {

    try {
        const categories = await Category.find({ isActive: true }).sort({ name: 1 });

        res.status(200).json({
            message: "Categories fetched successfully",
            categories
        });
    } catch (error) {
        console.error("Get categories error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


//UPDATE CATEGORY
export const updateCategory = async (req, res) => {

    try {

        const { id } = req.params;
        const { name, image, isActive } = req.body;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        if (name !== undefined) {
            category.name = name;
        }

        if (image !== undefined) {
            category.image = image;
        }

        if (isActive !== undefined) {
            category.isActive = isActive;
        }

        await category.save();

        res.status(200).json({
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        console.error("Update category error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};



//DELETE CATEGORY
export const deletecategory = async (req, res) => {

    try {

        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        await Category.findByIdAndDelete(id);

        res.status(200).json({
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.error("Delete category error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};