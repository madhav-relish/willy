"use client";
import React, { ReactNode } from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { useTopbar } from "@/store/useTopbar";
import NotificationPanel from "./NotificationPanel";

const Topbar = () => {
  const { title, component } = useTopbar();
  return (
    <div className="fixed top-0 flex items-center justify-between bg-background z-50 h-12 w-full md:w-3/4 p-3 border-b mb-4">
      <div>
        <div className="flex items-center gap-8">
          <div>{title}</div>
          <div>{component}</div>
        </div>
      </div>
      <NotificationPanel/>
    </div>
  );
};

export default Topbar;
