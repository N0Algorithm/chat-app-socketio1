import React from 'react';

const MessageItem = ({ message, currentUser }) => {
  const isOwn = message.sender.toLowerCase() === currentUser.toLowerCase();

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message-wrapper ${isOwn ? 'own-message' : 'other-message'}`}>
      <div className="message-bubble">
        {!isOwn && <div className="message-sender">{message.sender}</div>}
        <div className="message-text">{message.text}</div>
        <div className="message-meta">
          <span className="message-time">{formatTime(message.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
