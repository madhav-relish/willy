
import { create } from "zustand";

interface Notification {
    githubNotifications: Object[];
    setGithubNotifications: (notifications: Object[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;  
    setError: (error: string) => void 
}

export const useNotification = create<Notification>((set) => ({
    githubNotifications: [],
    loading: true,
    error: null,
    setGithubNotifications: (notifications) => set({ githubNotifications: notifications }),
    setLoading: (loading) => set({loading}),
    setError: (error) => set({error})
}));