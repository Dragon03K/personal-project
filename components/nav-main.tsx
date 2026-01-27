"use client";

import { type LucideIcon } from "lucide-react";
import { useRef } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: any;
  }[];
}) {
  const router = useRouter();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Personal Project</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const IconRef = useRef<any>(null);

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                className="group"
                onMouseEnter={() => IconRef.current?.startAnimation()}
                onMouseLeave={() => IconRef.current?.stopAnimation()}
                onClick={() => router.push(item.url)}
              >
                {item.icon && (
                  <item.icon
                    ref={IconRef}
                    size={20}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                )}
                <span className="transition-all duration-200 group-hover:translate-x-1">
                  {item.title}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
