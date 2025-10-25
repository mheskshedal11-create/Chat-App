import mongoose, { Schema } from "mongoose";


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        uniqure: true
    }, fullName: {
        type: String,
        required: true,

    }
    , password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePic: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        required: true
    }

}, { timestamps: true })

const User = mongoose.model('User', userSchema)
export default User