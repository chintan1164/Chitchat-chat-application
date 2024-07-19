import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        })

        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId],

            })
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        })

        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
        }

        await Promise.all([gotConversation.save(), newMessage.save()]);

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json({
            newMessage
        })

    } catch (error) {
        console.log(error);
    }
}

export const getMessage = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        }).populate("messages");

        const messagesWithPhotos = conversation.messages.map(msg => ({
            _id: msg._id,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            message: msg.message,
            photo: msg.photo ? `${msg.photo}` : null,
            createdAt: msg.createdAt,
            updatedAt: msg.updatedAt,
        }));

        return res.status(200).json(messagesWithPhotos);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", error });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const userId = req.id;
        const messageId = req.params.id;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        const conversation = await Conversation.findOne({ messages: messageId });

        if (conversation) {
            conversation.messages.pull(messageId);
            await conversation.save();
        }

        await Message.findByIdAndDelete(messageId);

        const receiverSocketId = getReceiverSocketId(message.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageDeleted", messageId);
        }

        return res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", error });
    }
};

export const sendPhoto = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const photoBuffer = req.file.buffer;
        const photoBinary = photoBuffer.toString('base64');

        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message: '',
            photo: photoBinary,
        });

        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
        }

        await Promise.all([gotConversation.save(), newMessage.save()]);

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json({
            newMessage
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", error });
    }
};