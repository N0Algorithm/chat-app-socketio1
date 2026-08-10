# Chat App Frontend

Frontend application for the real-time chat app, built with React and Socket.IO.

## Setup & Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Create a `.env` file if you are connecting to a non-default backend:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3. Start Development Server
```bash
npm start
```
App will open at `http://localhost:3000`.

---

## Folder Overview

- `src/components/`: Modular UI elements (Header, MessageList, MessageInput, LoginScreen, TypingIndicator).
- `src/services/`: API calls (`api.js`) and Socket.IO connection manager (`socket.js`).
- `src/App.js`: Main state handling and event listeners.
- `src/App.css`: App-wide styles and dark theme customization.
