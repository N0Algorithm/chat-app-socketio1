import React, { useState } from 'react';

const LoginScreen = ({ onJoin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setError('Please enter a username');
      return;
    }
    if (trimmed.length > 30) {
      setError('Username cannot exceed 30 characters');
      return;
    }
    setError('');
    onJoin(trimmed);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Join Chat</h2>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-banner">{error}</div>}
          <div className="form-group">
            <label htmlFor="username-input">Enter your username</label>
            <input
              id="username-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>
          <button type="submit" className="join-btn">
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
