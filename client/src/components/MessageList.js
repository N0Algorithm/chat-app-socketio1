import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';

const MessageList = ({ messages, currentUser, typingUsers, loading, error }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  return (
    <div className="message-list-container">
      {loading && (
        <div className="status-message">Loading message history...</div>
      )}

      {error && (
        <div className="error-banner">{error}</div>
      )}

      {!loading && messages.length === 0 && (
        <div className="empty-state">
          <span>💬</span>
          <p>No messages yet. Start the conversation!</p>
        </div>
      )}

      {messages.map((msg, index) => (
        <MessageItem
          key={msg._id || index}
          message={msg}
          currentUser={currentUser}
        />
      ))}

      <TypingIndicator typingUsers={typingUsers} />
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
