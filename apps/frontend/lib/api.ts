import axios from 'axios';
import { BACKEND_URL } from './constants';

const BACKEND_ENDPOINT = 'http://localhost:3002'

let token;
if (typeof window !== 'undefined') {
  token = localStorage.getItem('accessToken')
}

const apiClient = axios.create({
  baseURL: BACKEND_ENDPOINT,
  headers:{
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
})

export const fetchDrawings = async (roomId: string) => {
  const response = await axios.get(`${BACKEND_URL}/api/drawings/${roomId}`);
  return response.data;
};

export const createRoom = async (roomName: string)=>{
  try{
    const response = await apiClient.post('/create-room', { name: roomName})
    return response.data
  }catch(error){
    console.error("Error while creating the room::", error)
    throw error;
  }
}

export const joinRoom = async (roomId: string)=>{
  try{
    const response = await apiClient.post('/join-room', {roomId})
    return response.data;
  }catch(error){
    console.error("Error while joining room::", error)
    throw error;
  }
}

