"use client";
import { createContext, useContext, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { useUsers, useProjects, useTasks, useAllAttendance, useAllLeaves, useAllExpenses } from "@/hooks";
import type { User, Project, Task, Attendance, Leave, Expense } from "@/services/api.types";

// Map backend roles to frontend role format
const mapRole = (role: string): 'Owner' | 'Admin' | 'Member' | 'Viewer' => {
  const roleMap: Record<string, 'Owner' | 'Admin' | 'Member' | 'Viewer'> = {
    'OWNER': 'Owner',
    'ADMIN': 'Admin',
    'MEMBER': 'Member',
    'VIEWER': 'Viewer',
  };
  return roleMap[role] || 'Viewer';
};

// Map backend status to frontend format
const mapTaskStatus = (status: string): 'In Progress' | 'To Do' | 'Done' => {
  const statusMap: Record<string, 'In Progress' | 'To Do' | 'Done'> = {
    'TODO': 'To Do',
    'IN_PROGRESS': 'In Progress',
    'DONE': 'Done',
  };
  return statusMap[status] || 'To Do';
};

const mapAttendanceStatus = (status: string): 'Present' | 'Absent' | 'Remote' | 'On Leave' => {
  const statusMap: Record<string, 'Present' | 'Absent' | 'Remote' | 'On Leave'> = {
    'PRESENT': 'Present',
    'ABSENT': 'Absent',
    'REMOTE': 'Remote',
    'ON_LEAVE': 'On Leave',
  };
  return statusMap[status] || 'Present';
};

export type RoleAccess = {
  canManageProjects: boolean;
  canManageTasks: boolean;
  canViewAnalytics: boolean;
  canManageTeam: boolean;
  canMarkAttendance: boolean;
  canManageExpenses: boolean;
};

// Frontend-compatible types
export type FrontendUser = {
  id: string;
  name: string;
  role: 'Owner' | 'Admin' | 'Member' | 'Viewer';
  email: string;
  phone?: string;
  address?: string;
  team?: string;
  joined: string;
};

export type FrontendProject = {
  id: string;
  title: string;
  progress: number;
  members: FrontendUser[];
  isPublic?: boolean;
};

export type FrontendTask = {
  id: string;
  title: string;
  description?: string;
  status: 'In Progress' | 'To Do' | 'Done';
  priority: 'High' | 'Medium' | 'Low';
  projectId: string;
  assignedTo: string[];
  deadline?: string;
  classified?: boolean;
  isDraft?: boolean;
};

export type FrontendAttendance = {
  id: string;
  userId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Remote' | 'On Leave';
};

export type FrontendLeave = {
  id: string;
  userId: string;
  reason: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
};

export type FrontendExpense = {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  requestedBy: string;
  status: 'Approved' | 'Pending' | 'Rejected';
};

export type AppContextType = {
  currentUser: FrontendUser | null;
  users: FrontendUser[];
  projects: FrontendProject[];
  tasks: FrontendTask[];
  attendance: FrontendAttendance[];
  leaves: FrontendLeave[];
  expenses: FrontendExpense[];
  expenseCategories: string[];
  roleAccess: RoleAccess;
  isLoading: boolean;
  setProjects: (projects: FrontendProject[]) => void;
  setTasks: (tasks: FrontendTask[]) => void;
  setLeaves: (leaves: FrontendLeave[]) => void;
  setCurrentUser: (user: FrontendUser | null) => void;
  markAttendance: (status: FrontendAttendance['status']) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser, isAuthenticated } = useAuth();

  // Fetch real data from API
  const { data: usersData, isLoading: usersLoading } = useUsers();
  const { data: projectsData, isLoading: projectsLoading } = useProjects();
  const { data: tasksData, isLoading: tasksLoading } = useTasks();
  const { data: attendanceData, isLoading: attendanceLoading } = useAllAttendance();
  const { data: leavesData, isLoading: leavesLoading } = useAllLeaves();
  const { data: expensesData, isLoading: expensesLoading } = useAllExpenses();

  const isLoading = usersLoading || projectsLoading || tasksLoading || attendanceLoading || leavesLoading || expensesLoading;

  // Transform backend data to frontend format
  const currentUser: FrontendUser | null = useMemo(() => {
    if (!authUser) return null;
    return {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      role: mapRole(authUser.role),
      phone: authUser.phone,
      address: authUser.address,
      team: authUser.team,
      joined: authUser.joinedAt,
    };
  }, [authUser]);

  const users: FrontendUser[] = useMemo(() => {
    if (!usersData) return [];
    return usersData.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: mapRole(u.role),
      phone: u.phone,
      address: u.address,
      team: u.team,
      joined: u.joinedAt,
    }));
  }, [usersData]);

  const projects: FrontendProject[] = useMemo(() => {
    if (!projectsData) return [];
    return projectsData.map((p) => ({
      id: p.id,
      title: p.title,
      progress: p.progress,
      isPublic: p.isPublic,
      members: p.members.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        role: mapRole(m.role),
        joined: '',
      })),
    }));
  }, [projectsData]);

  const tasks: FrontendTask[] = useMemo(() => {
    if (!tasksData) return [];
    return tasksData.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: mapTaskStatus(t.status),
      priority: t.priority as 'High' | 'Medium' | 'Low',
      projectId: t.projectId,
      assignedTo: t.assignees?.map((a) => a.id) || [],
      deadline: t.deadline,
      classified: t.classified,
      isDraft: t.isDraft,
    }));
  }, [tasksData]);

  const attendance: FrontendAttendance[] = useMemo(() => {
    if (!attendanceData) return [];
    return attendanceData.map((a) => ({
      id: a.id,
      userId: a.userId,
      date: a.date.split('T')[0],
      status: mapAttendanceStatus(a.status),
    }));
  }, [attendanceData]);

  const leaves: FrontendLeave[] = useMemo(() => {
    if (!leavesData) return [];
    return leavesData.map((l) => ({
      id: l.id,
      userId: l.userId,
      reason: l.reason,
      date: l.date.split('T')[0],
      status: l.status as 'Approved' | 'Pending' | 'Rejected',
    }));
  }, [leavesData]);

  const expenses: FrontendExpense[] = useMemo(() => {
    if (!expensesData) return [];
    return expensesData.map((e) => ({
      id: e.id,
      title: e.title,
      category: e.category,
      amount: e.amount,
      date: e.date.split('T')[0],
      requestedBy: e.user?.name || 'Unknown',
      status: e.status as 'Approved' | 'Pending' | 'Rejected',
    }));
  }, [expensesData]);

  const expenseCategories = ["Infrastructure", "HR", "Design", "Marketing", "Operations", "SaaS", "Misc"];

  const roleAccess: RoleAccess = useMemo(() => {
    const role = currentUser?.role;
    return {
      canManageProjects: role ? ["Owner", "Admin"].includes(role) : false,
      canManageTasks: role ? ["Owner", "Admin", "Member"].includes(role) : false,
      canViewAnalytics: role ? ["Owner", "Admin", "Member", "Viewer"].includes(role) : false,
      canManageTeam: role ? ["Owner", "Admin"].includes(role) : false,
      canMarkAttendance: role ? ["Owner", "Admin", "Member"].includes(role) : false,
      canManageExpenses: role ? ["Owner", "Admin"].includes(role) : false,
    };
  }, [currentUser]);

  // These are now no-ops since we use React Query for mutations
  const setProjects = () => { };
  const setTasks = () => { };
  const setLeaves = () => { };
  const setCurrentUser = () => { };
  const markAttendance = () => { };

  const value: AppContextType = {
    currentUser,
    users,
    projects,
    tasks,
    attendance,
    leaves,
    expenses,
    expenseCategories,
    roleAccess,
    isLoading,
    setProjects,
    setTasks,
    setLeaves,
    setCurrentUser,
    markAttendance,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
