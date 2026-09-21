import Cart from "../models/Cart.js";
import MenuItem from "../models/MenuItem.js";
import Restaurant from "../models/Restaurant.js";

// ADD ITEM TO CART
export const addToCart = async (req, res) => {
    try {
        const { menuItemId, quantity } = req.body;

        if (!menuItemId || !quantity) {
            return res.status(400).json({
                message: "Menu item and quantity are required"
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }

        // Find menu item
        const menuItem = await MenuItem.findById(menuItemId);

        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        if (!menuItem.isAvailable) {
            return res.status(400).json({
                message: "Menu item is currently unavailable"
            });
        }

        // Find restaurant
        const restaurant = await Restaurant.findOne({
            _id: menuItem.restaurant,
            isApproved: true,
            isOpen: true
        });

        if (!restaurant) {
            return res.status(400).json({
                message: "Restaurant is currently unavailable"
            });
        }

        // Find customer's existing cart
        let cart = await Cart.findOne({
            user: req.user._id
        });

        // Create cart if customer doesn't have one
        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                restaurant: restaurant._id,
                items: [
                    {
                        menuItem: menuItem._id,
                        quantity
                    }
                ]
            });

            return res.status(201).json({
                message: "Item added to cart",
                cart
            });
        }

        // Check restaurant
        if (
            cart.restaurant.toString() !==
            restaurant._id.toString()
        ) {
            return res.status(400).json({
                message: "You can only order from one restaurant at a time"
            });
        }

        // Check if item already exists
        const existingItem = cart.items.find(
            (item) =>
                item.menuItem.toString() ===
                menuItemId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                menuItem: menuItem._id,
                quantity
            });
        }

        await cart.save();

        res.status(200).json({
            message: "Item added to cart",
            cart
        });

    } catch (error) {
        console.error("Add to cart error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

