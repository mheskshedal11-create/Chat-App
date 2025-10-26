import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.mode.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filterUsers = await User.find({ _id: { $ne: userId } }).select('-password');

        const unseenMessage = {};
        const promises = filterUsers.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id,
                receiverId: userId,
                seen: false
            });
            if (messages.length > 0) {
                unseenMessage[user._id] = messages.length;
            }
        });

        await Promise.all(promises);

        res.json({
            success: true,
            users: filterUsers,
            unseenMessage
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//get all message for selected user

export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params
        const myId = req.user._id
        const message = await Message.find({
            $or: [
                {
                    senderId: myId, receiverId: selectedUserId
                }, {
                    senderId: selectedUserId, receiverId: myId
                }
            ]
        })
        await Message.updateMnay({ senderId: selectedUserId, receiverId: myId }, { seen: true });
        res.json({ success: true, message })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// api to mark message as seen using message id

export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params
        await Message.findByIdAndUpdate(id, { see: true })
        res.status(200).json({
            success: true
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: true
        })
    }
}

//send message to selected user 

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body
        const receiverId = req.params.id
        const senderId = req.user._id
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;

        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        res.json(200).json({
            success: true,
            newMessage
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: true
        })
    }
}