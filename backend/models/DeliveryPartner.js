import mongoose from "mongoose";

const deliveryPartnerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        vehicleType: {
            type: String,
            enum: ["BIKE", "SCOOTER", "BICYCLE"],
            default: "BIKE"
        },

        vehicleNumber: {
            type: String,
            default: ""
        },

        isAvailable: {
            type: Boolean,
            default: false
        },

        currentLocation: {
            latitude: {
                type: Number,
                default: null
            },

            longitude: {
                type: Number,
                default: null
            }
        }
    },
    {
        timestamps: true
    }
);

const DeliveryPartner = mongoose.model(
    "DeliveryPartner",
    deliveryPartnerSchema
);

export default DeliveryPartner;