// API Response Types matching backend responses

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
    team?: string;
    phone?: string;
    address?: string;
    joinedAt: string;
    createdAt: string;
}

export interface Project {
    id: string;
    title: string;
    progress: number;
    isPublic: boolean;
    members: Pick<User, 'id' | 'name' | 'email' | 'role'>[];
    _count?: { tasks: number };
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    deadline?: string;
    classified: boolean;
    isDraft: boolean;
    projectId: string;
    project?: Pick<Project, 'id' | 'title'>;
    assignees: Pick<User, 'id' | 'name' | 'email'>[];
    createdAt: string;
    updatedAt: string;
}

export interface Attendance {
    id: string;
    date: string;
    status: 'PRESENT' | 'ABSENT' | 'REMOTE' | 'ON_LEAVE';
    userId: string;
    user?: Pick<User, 'id' | 'name' | 'email' | 'team'>;
    createdAt: string;
}

export interface Leave {
    id: string;
    reason: string;
    date: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    userId: string;
    user?: Pick<User, 'id' | 'name' | 'email' | 'team'>;
    createdAt: string;
    updatedAt: string;
}

export interface Expense {
    id: string;
    title: string;
    category: string;
    amount: number;
    date: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    userId: string;
    user?: Pick<User, 'id' | 'name' | 'email' | 'team'>;
    createdAt: string;
    updatedAt: string;
}

// Request DTOs
export interface CreateProjectDto {
    title: string;
    isPublic?: boolean;
    memberIds?: string[];
}

export interface UpdateProjectDto {
    title?: string;
    progress?: number;
    isPublic?: boolean;
    memberIds?: string[];
}

export interface CreateTaskDto {
    title: string;
    description?: string;
    projectId: string;
    status?: Task['status'];
    priority?: Task['priority'];
    deadline?: string;
    classified?: boolean;
    isDraft?: boolean;
    assigneeIds?: string[];
}

export interface UpdateTaskDto {
    title?: string;
    description?: string;
    status?: Task['status'];
    priority?: Task['priority'];
    deadline?: string;
    classified?: boolean;
    isDraft?: boolean;
    assigneeIds?: string[];
}

export interface CreateAttendanceDto {
    status: Attendance['status'];
    date?: string;
}

export interface CreateLeaveDto {
    reason: string;
    date: string;
}

export interface UpdateLeaveDto {
    status: Leave['status'];
}

export interface CreateExpenseDto {
    title: string;
    category: string;
    amount: number;
    date: string;
}

export interface UpdateExpenseDto {
    status: Expense['status'];
}

export interface UpdateUserDto {
    name?: string;
    team?: string;
    phone?: string;
    address?: string;
    role?: User['role'];
}
