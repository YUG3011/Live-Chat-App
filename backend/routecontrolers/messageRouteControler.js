import Conversation from '../Models/converationModels.js';
import Message from '../Models/messageSchema.js';
import { getReciverSocketId, io } from '../socket/Socket.js'; // Make sure io is imported

export const sendMessage = async (req, res) => {
  try {
    const { message, receiverId } = req.body;
    const senderId = req.user._id;

    if (!message || !receiverId) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Save the new message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
      conversationId: conversation._id,
    });

    //  Send message to receiver via socket
    const receiverSocketId = getReciverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage); // Must match frontend listener
    }

    res.status(201).json({
      success: true,
      message: "Message sent",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Get all messages of a conversation
export const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const selectedUserId = req.params.id; // This is the receiver's user ID

    // Find the conversation between the two users
    const conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, selectedUserId] },
    });

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: [], // No conversation yet means no messages
      });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
