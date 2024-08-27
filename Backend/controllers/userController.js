import { User } from "../models/userModel.js";
import { Conversation } from "../models/conversationModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from 'fs';

export const register = async (req, res) => {
    try {
        const { fullName, userName, password, confirmPassword, profilephoto, gender } = req.body;
        if (!fullName || !userName || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password do not match" })
        }

        const user = await User.findOne({ fullName });
        if (user) {
            return res.status(400).json({ message: "username already exist try different" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName,
            userName,
            password: hashedPassword,
            profilephoto,
            gender
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
            user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                userName: newUser.userName,
                profilephoto: newUser.profilephoto,
                gender: newUser.gender
            }
        })

    } catch (error) {
        console.log(error);
    }
};

export const login = async (req, res) => {
    try {
        const { userName, password } = req.body;

        if (!userName || !password) {
            return res.status(400).json({ message: "All fields are required" })
        };

        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ message: "Incorrect username or password", success: false })
        };

        const ispasswordmatch = await bcrypt.compare(password, user.password);

        if (!ispasswordmatch) {
            return res.status(400).json({ message: "Incorrect username or password", success: false })
        };

        const tockenData = {
            userId: user._id
        };

        const token = await jwt.sign(tockenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            profilephoto: user.profilephoto,
            gender: user.gender

        });

    } catch (error) {
        console.log(error);
    }
};

export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logged out successfully."
        })
    } catch (error) {
        console.log(error);
    }
};

export const getOtherUser = async (req, res) => {
    try {
        const loggedInUserId = req.id;

        const conversations = await Conversation.find({
            participants: loggedInUserId
        }).select("participants");

        const userIds = new Set();
        conversations.forEach(conversation => {
            conversation.participants.forEach(userId => {
                if (userId.toString() !== loggedInUserId) {
                    userIds.add(userId.toString());
                }
            });
        });

        const otherUsers = await User.find({
            _id: { $in: Array.from(userIds) }
        }).select("-password");

        return res.status(200).json(otherUsers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", error });
    }
};

export const getNewUser = async (req, res) => {
    try {
        const loggedInUserId = req.id;

        console.log('loggedin user', loggedInUserId);
        
        const conversations = await Conversation.find({
            participants: loggedInUserId
        }).select("participants");

        console.log('conversations', conversations);
        
        const userIdsInConversation = new Set();
        conversations.forEach(conversation => {
            console.log('conversation', conversation);
            conversation.participants.forEach(userId => {
                // console.log('conversation', conversations);
                if (userId.toString() !== loggedInUserId) {
                    userIdsInConversation.add(userId.toString());
                }
            });
        });
        
        const newUsers = await User.find({
            _id: { $nin: Array.from(userIdsInConversation).concat(loggedInUserId) }
        }).select("-password");
        console.log('newUser', newUsers);

        return res.status(200).json(newUsers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", error });
    }
};

export const editUser = async (req, res) => {
    try {
        const { userId, fullName, userName } = req.body;

        if (!userId || !fullName || !userName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.fullName = fullName;
        user.userName = userName;
        await user.save();

        return res.status(200).json({
            message: "User information updated successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                userName: user.userName,
                profilephoto: user.profilephoto,
                gender: user.gender,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update user information" });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword, confirmNewPassword } = req.body;

        if (!userId || !currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: "New passwords do not match" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to change password" });
    }
};

export const updateProfilePhoto = async (req, res) => {
    try {
        const { userId } = req.params;
        const base64Image = req.body.profilePhoto;

        if (!userId || !base64Image) {
            return res.status(400).json({ message: "User ID and profile photo are required" });
        }

        const user = await User.findByIdAndUpdate(userId, { profilephoto: base64Image }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Profile photo updated successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                userName: user.userName,
                profilephoto: user.profilephoto,
                gender: user.gender,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update profile photo" });
    }
};
