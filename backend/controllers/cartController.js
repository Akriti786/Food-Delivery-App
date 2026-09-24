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





// GET MY CART
export const getMyCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user._id
        })
            .populate("restaurant", "name image address")
            .populate(
                "items.menuItem",
                "name price image isVeg"
            );

        if (!cart) {
            return res.status(200).json({
                message: "Cart is empty",
                cart: null
            });
        }

        res.status(200).json({
            message: "Cart fetched successfully",
            cart
        });

    } catch (error) {
        console.error("Get cart error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// UPDATE CART ITEM QUANTITY
export const updateCartItem = async (req, res) => {
    try {
        const { menuItemId } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined) {
            return res.status(400).json({
                message: "Quantity is required"
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }

        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const cartItem = cart.items.find(
            (item) =>
                item.menuItem.toString() === menuItemId
        );

        if (!cartItem) {
            return res.status(404).json({
                message: "Item not found in cart"
            });
        }

        cartItem.quantity = quantity;

        await cart.save();

        res.status(200).json({
            message: "Cart quantity updated successfully",
            cart
        });

    } catch (error) {
        console.error("Update cart item error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};




// REMOVE ITEM FROM CART
export const removeCartItem = async (req, res) => {
    try {
        const { menuItemId } = req.params;

        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const itemExists = cart.items.some(
            (item) =>
                item.menuItem.toString() === menuItemId
        );

        if (!itemExists) {
            return res.status(404).json({
                message: "Item not found in cart"
            });
        }

        cart.items = cart.items.filter(
            (item) =>
                item.menuItem.toString() !== menuItemId
        );

        await cart.save();

        res.status(200).json({
            message: "Item removed from cart",
            cart
        });

    } catch (error) {
        console.error("Remove cart item error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};




// CLEAR ENTIRE CART
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        cart.items = [];

        await cart.save();

        res.status(200).json({
            message: "Cart cleared successfully",
            cart
        });

    } catch (error) {
        console.error("Clear cart error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};