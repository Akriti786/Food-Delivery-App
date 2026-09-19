import MenuItem from "../models/MenuItem.js";
import Restaurant from "../models/Restaurant.js";
import Category from "../models/Category.js";

// CREATE MENU ITEM
export const createMenuItem = async (req, res) => {
    try {
        const {
            category,
            name,
            description,
            price,
            image,
            isVeg
        } = req.body;

        // Check required fields
        if (!category || !name || price === undefined) {
            return res.status(400).json({
                message: "Category, name and price are required"
            });
        }

        // Find restaurant owned by logged-in user
        const restaurant = await Restaurant.findOne({
            owner: req.user._id
        });

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        // Check category
        const existingCategory = await Category.findById(category);

        if (!existingCategory) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        // Create menu item
        const menuItem = await MenuItem.create({
            restaurant: restaurant._id,
            category,
            name,
            description: description || "",
            price,
            image: image || "",
            isVeg: isVeg || false
        });

        res.status(201).json({
            message: "Menu item created successfully",
            menuItem
        });

    } catch (error) {
        console.error("Create menu item error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};