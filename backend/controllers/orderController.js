import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import Restaurant from "../models/Restaurant.js";

// CREATE ORDER FROM CART
export const createOrder = async (req, res) => {
    try {
        const {
            deliveryAddress,
            paymentMethod
        } = req.body;

        // 1. Validate address
        if (!deliveryAddress) {
            return res.status(400).json({
                message: "Delivery address is required"
            });
        }

        // 2. Only allow supported payment methods
        if (!["COD", "RAZORPAY"].includes(paymentMethod)) {
            return res.status(400).json({
                message: "Invalid payment method"
            });
        }

        // 3. Find customer's cart
        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        // 4. Check restaurant
        const restaurant = await Restaurant.findOne({
            _id: cart.restaurant,
            isApproved: true,
            isOpen: true
        });

        if (!restaurant) {
            return res.status(400).json({
                message: "Restaurant is currently unavailable"
            });
        }

        // 5. Get latest menu item details
        const menuItemIds = cart.items.map(
            (item) => item.menuItem
        );

        const menuItems = await MenuItem.find({
            _id: { $in: menuItemIds },
            restaurant: restaurant._id,
            isAvailable: true
        });

        if (menuItems.length !== cart.items.length) {
            return res.status(400).json({
                message: "One or more items are no longer available"
            });
        }

        // 6. Create order item snapshot
        const orderItems = cart.items.map((cartItem) => {
            const menuItem = menuItems.find(
                (item) =>
                    item._id.toString() ===
                    cartItem.menuItem.toString()
            );

            return {
                menuItem: menuItem._id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: cartItem.quantity
            };
        });

        // 7. Calculate subtotal
        const subtotal = orderItems.reduce(
            (total, item) =>
                total +
                item.price * item.quantity,
            0
        );

        // 8. Delivery fee
        const deliveryFee = restaurant.deliveryFee || 0;

        // 9. Discount
        const discount = 0;

        // 10. Final total
        const totalAmount =
            subtotal +
            deliveryFee -
            discount;

        // 11. Create order
        const order = await Order.create({
            customer: req.user._id,
            restaurant: restaurant._id,
            items: orderItems,
            subtotal,
            deliveryFee,
            discount,
            totalAmount,
            deliveryAddress,
            paymentMethod,
            paymentStatus:
                paymentMethod === "COD"
                    ? "PENDING"
                    : "PENDING",
            orderStatus: "PLACED"
        });

        // 12. Clear cart after successful order
        cart.items = [];

        await cart.save();

        res.status(201).json({
            message: "Order created successfully",
            order
        });

    } catch (error) {
        console.error("Create order error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET MY ORDERS
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            customer: req.user._id
        })
            .populate(
                "restaurant",
                "name image address"
            )
            .populate(
                "deliveryPartner",
                "vehicleType vehicleNumber"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            message: "Orders fetched successfully",
            orders
        });

    } catch (error) {
        console.error("Get my orders error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET SINGLE ORDER
// export const getOrderById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const order = await Order.findOne({
//             _id: id,
//             customer: req.user._id
//         })
//             .populate(
//                 "restaurant",
//                 "name image address phone"
//             )
//             .populate(
//                 "deliveryPartner",
//                 "vehicleType vehicleNumber"
//             );

//         if (!order) {
//             return res.status(404).json({
//                 message: "Order not found"
//             });
//         }

//         res.status(200).json({
//             message: "Order fetched successfully",
//             order
//         });

//     } catch (error) {
//         console.error("Get order error:", error);

//         res.status(500).json({
//             message: "Server error"
//         });
//     }
// };

// GET SINGLE ORDER FOR CUSTOMER
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findOne({
            _id: id,
            customer: req.user._id
        })
            .populate(
                "restaurant",
                "name image address phone deliveryTime"
            )
            .populate(
                "deliveryPartner",
                "vehicleType vehicleNumber"
            );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order tracking fetched successfully",
            order
        });

    } catch (error) {
        console.error(
            "Get order tracking error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET RESTAURANT ORDERS
export const getRestaurantOrders = async (req, res) => {
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

        // Get orders for this restaurant
        const orders = await Order.find({
            restaurant: restaurant._id
        })
            .populate(
                "customer",
                "name email phone address"
            )
            .populate(
                "deliveryPartner",
                "vehicleType vehicleNumber"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            message: "Restaurant orders fetched successfully",
            orders
        });

    } catch (error) {
        console.error(
            "Get restaurant orders error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};



// UPDATE ORDER STATUS BY RESTAURANT
export const updateOrderStatusByRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        const allowedStatuses = [
            "ACCEPTED",
            "REJECTED",
            "PREPARING",
            "READY"
        ];

        if (!allowedStatuses.includes(orderStatus)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const restaurant = await Restaurant.findOne({
            owner: req.user._id
        });

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        const order = await Order.findOne({
            _id: id,
            restaurant: restaurant._id
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // PLACED → ACCEPTED / REJECTED
        if (order.orderStatus === "PLACED") {

            if (
                orderStatus !== "ACCEPTED" &&
                orderStatus !== "REJECTED"
            ) {
                return res.status(400).json({
                    message:
                        "Placed order can only be accepted or rejected"
                });
            }
        }

        // ACCEPTED → PREPARING
        else if (order.orderStatus === "ACCEPTED") {

            if (orderStatus !== "PREPARING") {
                return res.status(400).json({
                    message:
                        "Accepted order can only move to preparing"
                });
            }
        }

        // PREPARING → READY
        else if (order.orderStatus === "PREPARING") {

            if (orderStatus !== "READY") {
                return res.status(400).json({
                    message:
                        "Preparing order can only move to ready"
                });
            }
        }

        // Any other status cannot be changed here
        else {
            return res.status(400).json({
                message:
                    `Order cannot be changed from ${order.orderStatus}`
            });
        }

        order.orderStatus = orderStatus;

        await order.save();

        res.status(200).json({
            message: `Order status updated to ${orderStatus}`,
            order
        });

    } catch (error) {
        console.error(
            "Update restaurant order status error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};