import axios from 'axios';

// Replace this with your actual Render URL (e.g., https://your-backend.onrender.com)
// Your exact Wi-Fi IP automatically retrieved for the physical phone to connect:
const RENDER_URL = 'https://binary-3.onrender.com';
const LOCAL_URL = 'http://172.19.5.229:8000'; 

const BASE_URL = LOCAL_URL; // Strictly connecting to LOCAL Django server

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predictDigit = async (base64Image, actualDigit) => {
  try {
    const response = await api.post('/MnistTorchQNN/', {
      image: `data:image/png;base64,${base64Image}`,
      actual: actualDigit,
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default api;
