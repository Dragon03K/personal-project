"use client";

import * as React from "react";
import { BookOpen, Bot, SquareTerminal } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { HomeIcon } from "./ui/home";
import { UsersIcon } from "./ui/users";
import { UserRoundPlusIcon } from "./ui/user-round-plus";
import { IdCardIcon } from "./ui/id-card";
import { BotIcon } from "./ui/bot";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: HomeIcon as any,
    },
    {
      title: "Users",
      url: "/dashboard/user",
      icon: UsersIcon,
    },
    {
      title: "Add",
      url: "/dashboard/add",
      icon: UserRoundPlusIcon,
    },
    {
      title: "Details",
      url: "/dashboard/details",
      icon: IdCardIcon,
    },
    {
      title: "AI Chat",
      url: "/dashboard/aichat",
      icon: BotIcon,
    },
    {
      title: "Saved AI Chat",
      url: "/dashboard/savedaichat",
      icon: BotIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
