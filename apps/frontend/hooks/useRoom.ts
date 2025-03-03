// import create from 'zustand';

interface RoomState {
  roomId: string;
  setRoomId: (id: string) => void;
}

// export const useRoomStore = create<RoomState>((set) => ({
//   roomId: '',
//   setRoomId: (id) => set({ roomId: id }),
// }));