# Real-Time Chat App

A clean, full-stack real-time chat application built with **React**, **Node.js**, **Express**, **MongoDB**, and **Socket.IO**.

---

## What's Inside

- **Instant Messaging**: Real-time message broadcasting using Socket.IO.
- **Chat History**: Past messages are saved in MongoDB and loaded automatically when you join.
- **Read & Delivered Status**: Single check mark (`✓`) when delivered, double check mark (`✓✓`) when read by other users in real time.
- **Online Counter & Status**: Displays who is currently online in the chat room.
- **Typing Indicators**: Shows live updates when another user is typing.
- **Clear Chat**: Clear room chat history whenever needed.
- **Dark Theme**: Clean, responsive layout that works smoothly on desktop and mobile.

---

## Tech Stack

- **Frontend**: React, Socket.IO Client, Axios, Plain CSS
- **Backend**: Node.js, Express, Socket.IO, Mongoose, MongoDB

---

## Quick Start

### 1. Prerequisites
- Node.js installed on your machine
- MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI

### 2. Install Dependencies

```bash
# Install server packages
cd server
npm install

# Install client packages
cd ../client
npm install
```

### 3. Environment Setup

Create a `.env` file in the `server` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/realtime_chat_app
CLIENT_URL=http://localhost:3000
```

### 4. Run the Project

**Terminal 1 (Start Server)**:
```bash
cd server
npm run dev
```

**Terminal 2 (Start Client)**:
```bash
cd client
npm start
```

Open `http://localhost:3000` in your browser. Open multiple tabs to test chatting in real-time!

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/messages` | Fetch chat history |
| `POST` | `/api/messages` | Send & save a new message |
| `DELETE` | `/api/messages` | Clear all messages from database |
| `GET` | `/api/health` | Health check endpoint |