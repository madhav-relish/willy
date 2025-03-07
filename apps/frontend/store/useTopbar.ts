import { ReactNode } from "react";
import { create } from "zustand";

interface topbar{
    title: string;
    component: ReactNode;
    setTitle: (title: string)=>void
    setComponent: (component: ReactNode)=>void
}

export const useTopbar = create<topbar>((set)=>({
    title: "",
    component: null,
    setTitle: (title: string)=>set({title}),
    setComponent: (component)=> set({component})
}))

