import React from 'react';

const ChatHeader = ({ currentUser, onlineUsers, isConnected, onLeave, onClearChat }) => {
  return (
    <header className="chat-header">
      <div className="header-title">
        <h2>Team Chat</h2>
        <span className="online-status">
          {isConnected ? `${onlineUsers.length} online` : 'Disconnected'}
        </span>
      </div>

      <div className="header-actions">
        <span className="user-name">{currentUser}</span>
        {onClearChat && (
          <button onClick={onClearChat} className="clear-btn" title="Clear chat history">
            Clear Chat
          </button>
        )}
        <button onClick={onLeave} className="leave-btn">Leave</button>
      </div>
    </header>
  );
};

export default ChatHeader;
