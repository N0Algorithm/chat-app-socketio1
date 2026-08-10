import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchMessages = async () => {
  const response = await api.get('/messages');
  return response.data;
};

export const sendMessage = async (sender, text) => {
  const response = await api.post('/messages', { sender, text });
  return response.data;
};

export const clearAllMessages = async () => {
  const response = await api.delete('/messages');
  return response.data;
};

export default api;
