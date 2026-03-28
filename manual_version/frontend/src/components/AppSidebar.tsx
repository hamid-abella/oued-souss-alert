import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from "./ui/sidebar.js";
import {
  IconLayoutDashboard,
  IconBellRinging,
  IconRouter,
  IconDroplet,
  IconActivity,
} from "@tabler/icons-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: IconLayoutDashboard },
  { to: "/alertes", label: "Alertes", icon: IconBellRinging },
  { to: "/capteurs", label: "Capteurs", icon: IconRouter },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <IconDroplet size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">Oued-Souss</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Monitoring des crues
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <NavLink
                      to={to}
                      end={to === "/"}
                      className="flex items-center gap-2"
                    >
                      <Icon size={16} />
                      <span>{label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <IconActivity size={14} />
          <span>Système actif</span>
          <span className="ml-auto h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
