import Restaurant from "../models/Restaurant.js";


// =========================
// GET ALL RESTAURANTS
// =========================

export const getAllRestaurantsAdmin = async (
    req,
    res
) => {

    try {

        const restaurants =
            await Restaurant.find()
                .populate(
                    "owner",
                    "name email phone"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            message:
                "Restaurants fetched successfully",
            restaurants
        });

    } catch (error) {

        console.error(
            "Get admin restaurants error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================
// APPROVE RESTAURANT
// =========================

export const approveRestaurant = async (
    req,
    res
) => {

    try {

        const restaurant =
            await Restaurant.findById(
                req.params.id
            );

        if (!restaurant) {

            return res.status(404).json({
                message:
                    "Restaurant not found"
            });
        }

        restaurant.isApproved = true;

        await restaurant.save();

        res.status(200).json({
            message:
                "Restaurant approved successfully",
            restaurant
        });

    } catch (error) {

        console.error(
            "Approve restaurant error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================
// REJECT RESTAURANT
// =========================

export const rejectRestaurant = async (
    req,
    res
) => {

    try {

        const restaurant =
            await Restaurant.findById(
                req.params.id
            );

        if (!restaurant) {

            return res.status(404).json({
                message:
                    "Restaurant not found"
            });
        }

        restaurant.isApproved = false;

        await restaurant.save();

        res.status(200).json({
            message:
                "Restaurant rejected successfully",
            restaurant
        });

    } catch (error) {

        console.error(
            "Reject restaurant error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================
// OPEN / CLOSE RESTAURANT
// =========================

export const updateRestaurantStatusAdmin =
    async (req, res) => {

        try {

            const {
                isOpen
            } = req.body;

            const restaurant =
                await Restaurant.findById(
                    req.params.id
                );

            if (!restaurant) {

                return res.status(404).json({
                    message:
                        "Restaurant not found"
                });
            }

            restaurant.isOpen = isOpen;

            await restaurant.save();

            res.status(200).json({
                message:
                    "Restaurant status updated",
                restaurant
            });

        } catch (error) {

            console.error(
                "Update restaurant status error:",
                error
            );

            res.status(500).json({
                message: "Server error"
            });
        }
    };