import axios from 'axios';
import { BACKEND_URL } from './constants';

export const fetchDrawings = async (roomId: string) => {
  const response = await axios.get(`${BACKEND_URL}/api/drawings/${roomId}`);
  return response.data;
};

export const createRoom = async (roomId: string) => {
  const response = await axios.post(`${BACKEND_URL}/api/rooms`, { roomId });
  return response.data;
};