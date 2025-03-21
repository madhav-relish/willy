import axios from 'axios';
import { BACKEND_URL } from './constants';
import {getCookie, useGetCookie} from 'cookies-next/client'
import useGetToken from '@/hooks/useGetCookie';
// import useGetCookie from '@/hooks/useGetCookie';

const BACKEND_ENDPOINT = 'http://localhost:3002'


// Helper function to get the token from cookies
export const getAuthToken = () => {
  const token = getCookie("authToken2");
  return token ? token.toString() : null;
};

export const apiClient = axios.create({
  baseURL: BACKEND_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


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

export const getAllRoomsOfUser = async()=>{
  try{
    const response = await apiClient.get('/all-rooms')
    return response.data
  }catch(error){
    console.error("Error while fetching all rooms::", error)
    throw error;
  }
}


export const getUserDeatils = async()=>{
  try{
    const response = await apiClient.get('/me')
    return response.data.user
  }catch(error){
    console.error("Error while fetching userDetails::", error)
    throw error
  }
}
