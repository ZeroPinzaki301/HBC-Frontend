import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationCode: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        profilePicture: { type: String, default: "uploads/profile-pictures/default.jpg" },
        agreedToPolicy: { type: Boolean, required: true }, // Indicates whether the user agreed
        agreedAt: { type: Date, default: null }, // Timestamp of agreement
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);
export default User;