import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log('mongoose connect successfully')
    } catch (error) {
        console.log(error)
    }
}