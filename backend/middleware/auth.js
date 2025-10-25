
// middleare to protect routes

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "No token found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

// controller to check if user is authenticated or not 

export const checkAuth = (req, res) => {
    res.status(400).json({
        success: true, user: req.user
    })
}
