import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        image: {
            type: String,
            default: ""
        },

        address: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        cuisines: [
            {
                type: String
            }
        ],

        deliveryTime: {
            type: Number,
            default: 30
        },

        deliveryFee: {
            type: Number,
            default: 0
        },

        rating: {
            type: Number,
            default: 0
        },

        isOpen: {
            type: Boolean,
            default: true
        },

        isApproved: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Restaurant = mongoose.model(
    "Restaurant",
    restaurantSchema
);

export default Restaurant;