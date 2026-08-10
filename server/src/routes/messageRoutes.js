const express = require('express');
const router = express.Router();
const { getMessages, createMessage, clearMessages } = require('../controllers/messageController');

router.route('/')
  .get(getMessages)
  .post(createMessage)
  .delete(clearMessages);

module.exports = router;
