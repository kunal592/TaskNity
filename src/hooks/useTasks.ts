'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksService, type Task, type CreateTaskDto, type UpdateTaskDto } from '@/services';
import toast from 'react-hot-toast';

export const TASKS_QUERY_KEY = ['tasks'];
export const CLASSIFIED_TASKS_QUERY_KEY = ['tasks', 'classified'];

export function useTasks(projectId?: string) {
    return useQuery({
        queryKey: projectId ? [...TASKS_QUERY_KEY, projectId] : TASKS_QUERY_KEY,
        queryFn: () => tasksService.getAll(projectId),
    });
}

export function useClassifiedTasks() {
    return useQuery({
        queryKey: CLASSIFIED_TASKS_QUERY_KEY,
        queryFn: () => tasksService.getClassified(),
    });
}

export function useProjectTasks(projectId: string) {
    return useQuery({
        queryKey: [...TASKS_QUERY_KEY, 'project', projectId],
        queryFn: () => tasksService.getByProject(projectId),
        enabled: !!projectId,
    });
}

export function useTask(id: string) {
    return useQuery({
        queryKey: [...TASKS_QUERY_KEY, id],
        queryFn: () => tasksService.getById(id),
        enabled: !!id,
    });
}

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTaskDto) => tasksService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
            toast.success('Task created successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create task');
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTaskDto }) =>
            tasksService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update task');
        },
    });
}

export function useUpdateTaskStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: Task['status'] }) =>
            tasksService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update task status');
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => tasksService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
            toast.success('Task deleted successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete task');
        },
    });
}
