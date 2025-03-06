"use client"

import * as React from "react"


import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useUserStore } from "@/lib/store/useUserStore"
import { sidebarMenu } from "@/lib/constants"

// This is sample data.


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUserStore();
  console.log("USER:::", user);
  
  // Clone sidebarMenu to avoid mutating the original object
  const updatedSidebarMenu = { ...sidebarMenu };
  
  // Find the "Rooms" section and update its items
  const roomsSection = updatedSidebarMenu.navMain.find(
    (ele) => ele.title === "Rooms"
  );
  
  if (roomsSection) {
    roomsSection.items = user.rooms.map((room) => ({
      title: room.slug,
      url: `/chat/${room.id}`,
    }));
  }
  
  console.log("Updated Sidebar Menu:::", updatedSidebarMenu);
  // console.log("SOME::", some)
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={updatedSidebarMenu.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={updatedSidebarMenu.navMain} />
        <NavProjects projects={updatedSidebarMenu.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={updatedSidebarMenu.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
