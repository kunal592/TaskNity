// Re-export types from AppContext for backwards compatibility
export type {
  FrontendUser as User,
  FrontendProject as Project,
  FrontendTask as Task,
  FrontendAttendance as Attendance,
  FrontendLeave as Leave,
  FrontendExpense as Expense,
  RoleAccess,
  AppContextType,
} from '@/context/AppContext';
