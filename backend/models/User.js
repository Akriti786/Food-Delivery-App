import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            default: ""
        },

        role: {
            type: String,
            enum: ["customer", "restaurant", "delivery", "admin"],
            default: "customer"
        },

        profileImage: {
            type: String,
            default: ""
        },

        address: {
            type: String,
            default: ""
        },

        isActive: {
            type: Boolean,
            default: ""
        },
    },
    {
        timestamps: true
    }
);


const User = mongoose.model("User", userSchema);

export default User;