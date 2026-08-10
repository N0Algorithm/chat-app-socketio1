import React, { useState, useEffect, useCallback } from 'react';
import LoginScreen from './components/LoginScreen';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import { fetchMessages, sendMessage, clearAllMessages } from './services/api';
import { socket, connectSocket, disconnectSocket } from './services/socket';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('chat_username') || '';
  });
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchMessages();
      if (res.success && Array.isArray(res.data)) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch message history:', err);
      setError('Could not connect to database/server to fetch chat history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    loadHistory();
    connectSocket(currentUser);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onNewMessage = (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });
    };

    const onOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    const onTypingStart = ({ username }) => {
      if (username === currentUser) return;
      setTypingUsers((prev) => (prev.includes(username) ? prev : [...prev, username]));
    };

    const onTypingStop = ({ username }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message:new', onNewMessage);
    socket.on('user:online', onOnlineUsers);
    socket.on('typing:start', onTypingStart);
    socket.on('typing:stop', onTypingStop);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message:new', onNewMessage);
      socket.off('user:online', onOnlineUsers);
      socket.off('typing:start', onTypingStart);
      socket.off('typing:stop', onTypingStop);
      disconnectSocket();
    };
  }, [currentUser]);

  const handleJoin = (username) => {
    localStorage.setItem('chat_username', username);
    setCurrentUser(username);
  };

  const handleLeave = () => {
    localStorage.removeItem('chat_username');
    disconnectSocket();
    setCurrentUser('');
    setMessages([]);
  };

  const handleSendMessage = async (text) => {
    try {
      await sendMessage(currentUser, text);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Message failed to send. Please try again.');
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm('Are you sure you want to clear all chat history?')) return;
    try {
      await clearAllMessages();
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear chat:', err);
      setError('Failed to clear chat history.');
    }
  };

  const handleTypingStart = useCallback(() => {
    if (socket.connected) {
      socket.emit('typing:start');
    }
  }, []);

  const handleTypingStop = useCallback(() => {
    if (socket.connected) {
      socket.emit('typing:stop');
    }
  }, []);

  if (!currentUser) {
    return <LoginScreen onJoin={handleJoin} />;
  }

  return (
    <div className="chat-app-container">
      <ChatHeader
        currentUser={currentUser}
        onlineUsers={onlineUsers}
        isConnected={isConnected}
        onLeave={handleLeave}
        onClearChat={handleClearChat}
      />
      <MessageList
        messages={messages}
        currentUser={currentUser}
        typingUsers={typingUsers}
        loading={loading}
        error={error}
      />
      <MessageInput
        onSendMessage={handleSendMessage}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
      />
    </div>
  );
}

export default App;
