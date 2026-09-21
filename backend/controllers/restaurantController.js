import Restaurant from "../models/Restaurant.js";

export const createRestaurant = async (req, res) => {

    try {

        const {
            name,
            description,
            image,
            address,
            city,
            cuisines,
            deliveryTime,
            deliveryFee
        } = req.body

        if (!name || !address || !city) {
            return res.status(400).json({
                message: "Name,address and city are required"
            });
        }

        const existingRestaurant = await Restaurant.findOne({
            owner: req.user._id
        });

        if (existingRestaurant) {
            return res.status(400).json({
                message: "You already have a restaurant"
            });
        }


        const restaurant = await Restaurant.create({
            owner: req.user._id,
            name,
            description: description || "",
            image: image || "",
            address,
            city,
            cuisines: cuisines || [],
            deliveryTime: deliveryTime || 30,
            deliveryFee: deliveryFee || 0
        });

        res.status(201).json({
            message: "Restaurant created successfully",
            restaurant
        });

    } catch (error) {
        console.log("Create restaurant error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


export const getMyRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({
            owner: req.user._id
        });

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        res.status(200).json({
            message: "Restaurant fetched successfully",
            restaurant
        });

    } catch (error) {
        console.error("Get restaurant error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// UPDATE MY RESTAURANT
export const updateMyRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({
            owner: req.user._id
        });

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        const {
            name,
            description,
            image,
            address,
            city,
            cuisines,
            deliveryTime,
            deliveryFee
        } = req.body;

        // Update only fields that were sent
        if (name !== undefined) {
            restaurant.name = name;
        }

        if (description !== undefined) {
            restaurant.description = description;
        }

        if (image !== undefined) {
            restaurant.image = image;
        }

        if (address !== undefined) {
            restaurant.address = address;
        }

        if (city !== undefined) {
            restaurant.city = city;
        }

        if (cuisines !== undefined) {
            restaurant.cuisines = cuisines;
        }

        if (deliveryTime !== undefined) {
            restaurant.deliveryTime = deliveryTime;
        }

        if (deliveryFee !== undefined) {
            restaurant.deliveryFee = deliveryFee;
        }

        await restaurant.save();

        res.status(200).json({
            message: "Restaurant updated successfully",
            restaurant
        });

    } catch (error) {
        console.error("Update restaurant error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};




// UPDATE RESTAURANT OPEN/CLOSE STATUS
export const updateRestaurantStatus = async (req, res) => {
    try {
        const { isOpen } = req.body;

        // Check whether isOpen was provided
        if (isOpen === undefined) {
            return res.status(400).json({
                message: "isOpen is required"
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

        restaurant.isOpen = isOpen;

        await restaurant.save();

        res.status(200).json({
            message: restaurant.isOpen
                ? "Restaurant is now open"
                : "Restaurant is now closed",
            restaurant
        });

    } catch (error) {
        console.error("Update restaurant status error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};



// DELETE MY RESTAURANT
export const deleteMyRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({
            owner: req.user._id
        });

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        await Restaurant.findByIdAndDelete(
            restaurant._id
        );

        res.status(200).json({
            message: "Restaurant deleted successfully"
        });

    } catch (error) {
        console.error("Delete restaurant error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};




// GET ALL RESTAURANTS
export const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({
            isApproved: true,
            isOpen: true
        }).populate(
            "owner",
            "name email"
        );

        res.status(200).json({
            message: "Restaurants fetched successfully",
            restaurants
        });

    } catch (error) {
        console.error("Get restaurants error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};