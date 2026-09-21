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


// GET MY MENU ITEMS
export const getMyMenuItems = async (req, res) => {
    try {
        // Find restaurant owned by logged-in user
        const restaurant = await Restaurant.findOne({
            owner: req.user._id
        });

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        // Find menu items of this restaurant
        const menuItems = await MenuItem.find({
            restaurant: restaurant._id
        }).populate("category", "name");

        res.status(200).json({
            message: "Menu items fetched successfully",
            menuItems
        });

    } catch (error) {
        console.error("Get menu items error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// UPDATE MENU ITEM
export const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            category,
            name,
            description,
            price,
            image,
            isVeg,
            isAvailable
        } = req.body;

        // Find restaurant owned by logged-in user
        const restaurant = await Restaurant.findOne({
            owner: req.user._id
        });

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        // Find menu item belonging to this restaurant
        const menuItem = await MenuItem.findOne({
            _id: id,
            restaurant: restaurant._id
        });

        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        // If category is being changed, check it exists
        if (category !== undefined) {
            const existingCategory = await Category.findById(category);

            if (!existingCategory) {
                return res.status(404).json({
                    message: "Category not found"
                });
            }

            menuItem.category = category;
        }

        if (name !== undefined) {
            menuItem.name = name;
        }

        if (description !== undefined) {
            menuItem.description = description;
        }

        if (price !== undefined) {
            menuItem.price = price;
        }

        if (image !== undefined) {
            menuItem.image = image;
        }

        if (isVeg !== undefined) {
            menuItem.isVeg = isVeg;
        }

        if (isAvailable !== undefined) {
            menuItem.isAvailable = isAvailable;
        }

        await menuItem.save();

        res.status(200).json({
            message: "Menu item updated successfully",
            menuItem
        });

    } catch (error) {
        console.error("Update menu item error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};





// DELETE MENU ITEM
export const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Find restaurant owned by logged-in user
        const restaurant = await Restaurant.findOne({
            owner: req.user._id
        });

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        // Find menu item belonging to this restaurant
        const menuItem = await MenuItem.findOne({
            _id: id,
            restaurant: restaurant._id
        });

        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        // Delete menu item
        await MenuItem.findByIdAndDelete(id);

        res.status(200).json({
            message: "Menu item deleted successfully"
        });

    } catch (error) {
        console.error("Delete menu item error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};



//GET RESTAURANT MEUN ITEMS
// GET RESTAURANT MENU
export const getRestaurantMenu = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // Check restaurant exists
        const restaurant = await Restaurant.findOne({
            _id: restaurantId,
            isApproved: true,
            isOpen: true
        });

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found or currently closed"
            });
        }

        // Get available menu items
        const menuItems = await MenuItem.find({
            restaurant: restaurantId,
            isAvailable: true
        }).populate(
            "category",
            "name"
        );

        res.status(200).json({
            message: "Restaurant menu fetched successfully",
            restaurant: {
                id: restaurant._id,
                name: restaurant.name
            },
            menuItems
        });

    } catch (error) {
        console.error("Get restaurant menu error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};