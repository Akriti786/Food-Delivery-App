import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {

        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        discountType: {
            type: String,
            enum: ["FLAT", "PERCENTAGE"],
            required: true
        },

        discountValue: {
            type: Number,
            required: true,
            min: 0
        },

        minimumOrderAmount: {
            type: Number,
            default: 0
        },

        maximumDiscount: {
            type: Number,
            default: null
        },

        expiryDate: {
            type: Date,
            required: true
        },

        useageLimit: {
            type: Number,
            default: 100
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },

    {
        timestamps: true
    }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;