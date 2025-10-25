import { generateToken } from '../lib/utils.js'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'

export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body

    try {
        if (!fullName || !email || !password || !bio) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        })

        const token = generateToken(newUser._id)

        return res.status(201).json({
            success: true,
            message: 'New user registered successfully',
            user: newUser,
            token
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error during user registration',
            error: error.message
        })
    }
}


// ===========for login==============

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required.",
        });
    }

    try {
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const token = generateToken(user._id);
        const { password: _, ...userWithoutPassword } = user.toObject();

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: userWithoutPassword,
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};