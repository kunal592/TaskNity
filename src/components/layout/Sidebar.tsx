"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useMemo, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import {
  Home, BarChart2, Users, CreditCard, CalendarDays, LogOut, Trello,
  ChevronLeft, ChevronRight, AlertTriangle, Briefcase, DollarSign,
  Eye, FolderKanban, ClipboardCheck, Heart, Calendar, MessageCircle,
  Folder, Shield, Wallet, PanelLeftClose, PanelLeft, BookOpen, FileText
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  access?: boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

// Sidebar context for layout responsiveness
export const SidebarContext = createContext<{
  isOpen: boolean;
  isCollapsed: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: true,
  isCollapsed: false,
  setIsOpen: () => { },
});

export const useSidebar = () => useContext(SidebarContext);

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true); // Start open by default
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Safe access to context - provide defaults
  const appContext = useApp();
  const authContext = useAuth();

  const roleAccess = appContext?.roleAccess ?? {
    canManageProjects: false,
    canManageTasks: false,
    canViewAnalytics: false,
    canManageTeam: false,
    canMarkAttendance: false,
    canManageExpenses: false,
  };

  const user = authContext?.user ?? null;
  const logout = authContext?.logout ?? (() => { });
  const isAuthenticated = authContext?.isAuthenticated ?? false;

  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Grouped navigation items - memoized to prevent re-creation
  const navGroups: NavGroup[] = useMemo(() => [
    {
      title: "Core",
      items: [
        { label: "Dashboard", href: "/", icon: <Home size={18} strokeWidth={1.8} /> },
        { label: "Tasks", href: "/tasks", icon: <Trello size={18} strokeWidth={1.8} />, access: roleAccess.canManageTasks },
        { label: "Projects", href: "/projects", icon: <FolderKanban size={18} strokeWidth={1.8} />, access: roleAccess.canManageProjects },
        { label: "Analytics", href: "/analytics", icon: <BarChart2 size={18} strokeWidth={1.8} />, access: roleAccess.canViewAnalytics },
        { label: "Guide", href: "/guide", icon: <BookOpen size={18} strokeWidth={1.8} /> },
      ]
    },
    {
      title: "Collaborate",
      items: [
        { label: "Meetings", href: "/meetings", icon: <Calendar size={18} strokeWidth={1.8} /> },
        { label: "Chat", href: "/chat", icon: <MessageCircle size={18} strokeWidth={1.8} />, access: roleAccess.canManageTasks },
        { label: "Kudos", href: "/kudos", icon: <Heart size={18} strokeWidth={1.8} /> },
        { label: "Documents", href: "/docs", icon: <Folder size={18} strokeWidth={1.8} /> },
      ]
    },
    {
      title: "HR",
      items: [
        { label: "Attendance", href: "/attendance", icon: <CalendarDays size={18} strokeWidth={1.8} />, access: roleAccess.canMarkAttendance },
        { label: "Leave Mgmt", href: "/leave-status", icon: <ClipboardCheck size={18} strokeWidth={1.8} />, access: roleAccess.canManageTeam },
        { label: "Expenses", href: "/expenses", icon: <CreditCard size={18} strokeWidth={1.8} />, access: roleAccess.canManageExpenses },
        { label: "My Requests", href: "/expenses/my-requests", icon: <CreditCard size={18} strokeWidth={1.8} />, access: !roleAccess.canManageExpenses },
        { label: "Profile", href: "/profile", icon: <Users size={18} strokeWidth={1.8} /> },
      ]
    },
    {
      title: "Admin",
      items: [
        { label: "Team", href: "/admin/team", icon: <Briefcase size={18} strokeWidth={1.8} />, access: roleAccess.canManageTeam },
        { label: "Payroll", href: "/admin/payroll", icon: <Wallet size={18} strokeWidth={1.8} />, access: roleAccess.canManageTeam },
        { label: "Finance", href: "/admin/finance", icon: <DollarSign size={18} strokeWidth={1.8} />, access: roleAccess.canManageTeam },
        { label: "Invoices", href: "/admin/invoices", icon: <FileText size={18} strokeWidth={1.8} />, access: roleAccess.canManageTeam },
        { label: "Notices", href: "/admin/notices", icon: <AlertTriangle size={18} strokeWidth={1.8} />, access: roleAccess.canManageTeam },
        { label: "Access", href: "/admin/access", icon: <Shield size={18} strokeWidth={1.8} />, access: roleAccess.canManageTeam },
        { label: "Classified", href: "/classified", icon: <Eye size={18} strokeWidth={1.8} />, access: roleAccess.canManageTeam },
      ]
    }
  ], [roleAccess]);

  const roleColors: Record<string, { bg: string; text: string }> = {
    OWNER: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
    ADMIN: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
    MEMBER: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    VIEWER: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400' },
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href) ?? false;
  };

  const sidebarWidth = isCollapsed ? 72 : 256; // px values for calculations

  return (
    <SidebarContext.Provider value={{ isOpen, isCollapsed, setIsOpen }}>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 shadow-lg z-40 flex flex-col transition-all duration-300 ease-in-out",
          isOpen ? (isCollapsed ? "w-[72px]" : "w-64") : "w-0 -translate-x-full"
        )}
      >
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-3 border-b border-gray-100 dark:border-gray-800">
          {!isCollapsed && isOpen && (
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                TaskNity
              </span>
            </Link>
          )}

          <div className="flex items-center gap-1">
            {isOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-8 w-8 text-gray-500 hover:text-gray-700"
              >
                {isCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="h-8 w-8 text-gray-500 hover:text-gray-700"
            >
              {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        {isOpen && (
          <div className="flex-1 overflow-y-auto py-2 px-2">
            {navGroups.map((group) => {
              const visibleItems = group.items.filter(item => item.access !== false);
              if (visibleItems.length === 0) return null;

              return (
                <div key={group.title} className="mb-4">
                  {/* Section Title */}
                  {!isCollapsed && (
                    <p className="px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      {group.title}
                    </p>
                  )}
                  {isCollapsed && <div className="h-2" />}

                  {/* Items */}
                  <div className="space-y-0.5">
                    {visibleItems.map((item) => {
                      const active = isActive(item.href);

                      const linkContent = (
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 h-9 rounded-lg transition-all duration-150 group relative",
                            isCollapsed ? "justify-center px-0" : "px-3",
                            active
                              ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-medium"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                          )}
                        >
                          {/* Active indicator */}
                          {active && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-purple-600 rounded-r-full" />
                          )}

                          <span className={cn(
                            "flex-shrink-0",
                            active && "text-purple-600 dark:text-purple-400"
                          )}>
                            {item.icon}
                          </span>

                          {!isCollapsed && (
                            <span className="text-sm truncate">{item.label}</span>
                          )}
                        </Link>
                      );

                      if (isCollapsed) {
                        return (
                          <Tooltip key={item.href}>
                            <TooltipTrigger asChild>
                              {linkContent}
                            </TooltipTrigger>
                            <TooltipContent side="right" className="font-medium">
                              {item.label}
                            </TooltipContent>
                          </Tooltip>
                        );
                      }

                      return <div key={item.href}>{linkContent}</div>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* User Footer */}
        {isOpen && (
          <div className="border-t border-gray-100 dark:border-gray-800 p-3">
            {isAuthenticated && user ? (
              <div className={cn(
                "flex items-center gap-3",
                isCollapsed && "justify-center"
              )}>
                <Avatar className="h-9 w-9 ring-2 ring-purple-100 dark:ring-purple-900">
                  <AvatarImage src={`https://i.pravatar.cc/36?u=${user.id}`} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                    {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name || 'User'}</p>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] px-1.5 py-0",
                          user.role && roleColors[user.role]?.bg,
                          user.role && roleColors[user.role]?.text
                        )}
                      >
                        {user.role || 'User'}
                      </Badge>
                      <span className="flex items-center gap-1 text-[10px] text-gray-400">
                        <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                        Online
                      </span>
                    </div>
                  </div>
                )}

                {!isCollapsed && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Logout</TooltipContent>
                  </Tooltip>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="default" className={cn("w-full", isCollapsed && "px-0")}>
                  {isCollapsed ? <LogOut size={16} /> : "Sign In"}
                </Button>
              </Link>
            )}
          </div>
        )}
      </aside>

      {/* Toggle button when sidebar is closed */}
      {!isOpen && (
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="fixed top-3 left-3 z-50 h-10 w-10 rounded-full shadow-lg"
        >
          <ChevronRight size={18} />
        </Button>
      )}

      {/* Spacer to push main content - this CSS custom property is used by layout */}
      <style jsx global>{`
        :root {
          --sidebar-width: ${isOpen ? (isCollapsed ? '72px' : '256px') : '0px'};
        }
      `}</style>
    </SidebarContext.Provider>
  );
}
