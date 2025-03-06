import {create} from 'zustand';

interface RoomState {
  roomId: string;
  allRooms: string[]
  // setRoomId: (id: string) => void;
  // setAllRooms: ()=>void
}

export const useRoomStore = create<RoomState>((set) => ({
  roomId: '',
  allRooms: [],
  // setRoomId: (id) => set({ roomId: id }),
  // setAllRooms: ()=> set(prev=> [...prev, ])
}));