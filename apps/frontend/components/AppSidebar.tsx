"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useUserStore } from "@/store/useUserStore";
import { sidebarMenu } from "@/lib/constants";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUserStore();
  const pathname = usePathname();

  const [isHidden, setIsHidden] = React.useState(false);

  React.useEffect(() => {
    const hidden = pathname === "/signin" || pathname === "/signup";
    setIsHidden(hidden);
  }, [pathname]);

  const updatedSidebarMenu = { ...sidebarMenu };

  const roomsSection = updatedSidebarMenu?.navMain?.find(
    (ele) => ele.title === "Rooms"
  );

  updatedSidebarMenu.user = {
    name: user?.username || "Username",
    email: user?.email || "email",
    avatar: "",
  };

  if (roomsSection) {
    roomsSection.items = user?.rooms?.map((room) => ({
      title: room.slug,
      url: `/chat/${room.id}`,
    }));
  }

  return (
    <>
    {isHidden ? <></> :<Sidebar hidden collapsible="icon" {...props}>
      <SidebarHeader className="flex flex-row items-center gap-2">
        <TeamSwitcher teams={updatedSidebarMenu.teams} />
        <SidebarTrigger />
      </SidebarHeader>
    {!isHidden &&  <SidebarTrigger />}

      <SidebarContent>
        <NavMain items={updatedSidebarMenu.navMain} />
        <NavProjects projects={updatedSidebarMenu.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={updatedSidebarMenu?.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>}
    </>
  );
}
