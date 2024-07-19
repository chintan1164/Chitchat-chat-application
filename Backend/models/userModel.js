import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    userName: {
        type: String,
        require: true,
        unique: true
    },
    fullName: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    profilephoto: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        require: true
    }
}, { timestamps: true });

export const User = mongoose.model("User", userModel);