import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
});

export const askAgent = async (query) => {
  const res = await API.post('/ask-agent', { query });
  return res.data.response;
};