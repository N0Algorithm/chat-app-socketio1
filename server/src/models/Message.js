const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true,
      minlength: [1, 'Sender name cannot be empty'],
      maxlength: [50, 'Sender name cannot exceed 50 characters']
    },
    text: {
      type: String,
      required: [true, 'Message text is required'],
      trim: true,
      minlength: [1, 'Message text cannot be empty'],
      maxlength: [1000, 'Message text cannot exceed 1000 characters']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Message', messageSchema);
