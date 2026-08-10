const Message = require('../models/Message');

const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

const createMessage = async (req, res, next) => {
  try {
    const { sender, text } = req.body;

    if (!sender || !sender.trim()) {
      return res.status(400).json({ success: false, message: 'Sender name is required' });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    const newMessage = await Message.create({
      sender: sender.trim(),
      text: text.trim()
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('message:new', newMessage);
    }

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    next(error);
  }
};

const clearMessages = async (req, res, next) => {
  try {
    await Message.deleteMany({});
    res.status(200).json({ success: true, message: 'All messages cleared successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessages,
  createMessage,
  clearMessages
};
