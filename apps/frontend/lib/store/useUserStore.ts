import { StringValidation } from 'zod';
import { create } from 'zustand'

interface Room{
  id: string;
  slug: string;
}

interface User {
  username: string;
  userId: string;
  rooms: Room[];
  email: string;
}

interface UserStore {
  user: User;
  setUser: (user: Partial<User>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: {
    username: "",
    userId: "",
    rooms: [],
    email: "",
  },
  setUser: (updatedUser) =>
    set((state) => ({
      user: { ...state.user, ...updatedUser },
    })),
}));
