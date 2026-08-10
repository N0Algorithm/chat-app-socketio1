import React, { useState, useRef } from 'react';

const MessageInput = ({ onSendMessage, onTypingStart, onTypingStop }) => {
  const [text, setText] = useState('');
  const typingTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    setText(e.target.value);

    if (onTypingStart) {
      onTypingStart();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (onTypingStop) {
        onTypingStop();
      }
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (onTypingStop) {
      onTypingStop();
    }

    onSendMessage(text.trim());
    setText('');
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input"
        placeholder="Type a message..."
        value={text}
        onChange={handleInputChange}
      />
      <button type="submit" className="send-btn" disabled={!text.trim()}>
        Send
      </button>
    </form>
  );
};

export default MessageInput;
