import bcrypt from "bcryptjs";
import User from "../models/User.js";
import DeliveryPartner from "../models/DeliveryPartner.js";
import Order from "../models/Order.js";

// CREATE DELIVERY PARTNER
export const createDeliveryPartner = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            vehicleType,
            vehicleNumber
        } = req.body;

        if (
            !name ||
            !email ||
            !password ||
            !vehicleType ||
            !vehicleNumber
        ) {
            return res.status(400).json({
                message: "All required fields must be provided"
            });
        }

        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone: phone || "",
            role: "delivery"
        });

        const deliveryPartner =
            await DeliveryPartner.create({
                user: user._id,
                vehicleType,
                vehicleNumber,
                isAvailable: true
            });

        res.status(201).json({
            message: "Delivery partner created successfully",
            deliveryPartner: {
                id: deliveryPartner._id,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                },
                vehicleType:
                    deliveryPartner.vehicleType,
                vehicleNumber:
                    deliveryPartner.vehicleNumber,
                isAvailable:
                    deliveryPartner.isAvailable
            }
        });

    } catch (error) {
        console.error(
            "Create delivery partner error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};





// GET READY ORDERS
export const getReadyOrders = async (req, res) => {
    try {
        const deliveryPartner = await DeliveryPartner.findOne({
            user: req.user._id
        });

        if (!deliveryPartner) {
            return res.status(404).json({
                message: "Delivery partner not found"
            });
        }

        const orders = await Order.find({
            orderStatus: "READY",
            deliveryPartner: null
        })
            .populate("customer", "name phone address")
            .populate("restaurant", "name address phone")
            .sort({ createdAt: 1 });

        res.status(200).json({
            message: "Ready orders fetched successfully",
            orders
        });

    } catch (error) {
        console.error(
            "Get ready orders error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};



// ASSIGN ORDER TO MYSELF
export const assignOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find delivery partner
        const deliveryPartner = await DeliveryPartner.findOne({
            user: req.user._id
        });

        if (!deliveryPartner) {
            return res.status(404).json({
                message: "Delivery partner not found"
            });
        }

        // Check if delivery partner is available
        if (!deliveryPartner.isAvailable) {
            return res.status(400).json({
                message: "Delivery partner is currently unavailable"
            });
        }

        // Find READY order that is not assigned
        const order = await Order.findOne({
            _id: orderId,
            orderStatus: "READY",
            deliveryPartner: null
        });

        if (!order) {
            return res.status(404).json({
                message:
                    "Order not found, already assigned, or not ready"
            });
        }

        // Assign order to this delivery partner
        order.deliveryPartner = deliveryPartner._id;
        order.orderStatus = "ASSIGNED";

        await order.save();

        res.status(200).json({
            message: "Order assigned successfully",
            order
        });

    } catch (error) {
        console.error(
            "Assign order error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};



// UPDATE DELIVERY ORDER STATUS
export const updateDeliveryOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body;

        const allowedStatuses = [
            "PICKED_UP",
            "OUT_FOR_DELIVERY",
            "DELIVERED"
        ];

        if (!allowedStatuses.includes(orderStatus)) {
            return res.status(400).json({
                message: "Invalid delivery status"
            });
        }

        // Find delivery partner
        const deliveryPartner = await DeliveryPartner.findOne({
            user: req.user._id
        });

        if (!deliveryPartner) {
            return res.status(404).json({
                message: "Delivery partner not found"
            });
        }

        // Find only orders assigned to this delivery partner
        const order = await Order.findOne({
            _id: orderId,
            deliveryPartner: deliveryPartner._id
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found or not assigned to you"
            });
        }

        // Control status progression
        if (order.orderStatus === "ASSIGNED") {

            if (orderStatus !== "PICKED_UP") {
                return res.status(400).json({
                    message:
                        "Assigned order can only move to PICKED_UP"
                });
            }

        } else if (order.orderStatus === "PICKED_UP") {

            if (orderStatus !== "OUT_FOR_DELIVERY") {
                return res.status(400).json({
                    message:
                        "Picked up order can only move to OUT_FOR_DELIVERY"
                });
            }

        } else if (order.orderStatus === "OUT_FOR_DELIVERY") {

            if (orderStatus !== "DELIVERED") {
                return res.status(400).json({
                    message:
                        "Out for delivery order can only move to DELIVERED"
                });
            }

        } else {
            return res.status(400).json({
                message:
                    `Order cannot be changed from ${order.orderStatus}`
            });
        }

        order.orderStatus = orderStatus;

        await order.save();

        res.status(200).json({
            message:
                `Order status updated to ${orderStatus}`,
            order
        });

    } catch (error) {
        console.error(
            "Update delivery order status error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};