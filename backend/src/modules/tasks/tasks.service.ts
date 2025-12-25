import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) { }

    // Get all non-classified, non-draft tasks (for Kanban board)
    async findAll(projectId?: string) {
        return this.prisma.task.findMany({
            where: {
                classified: false,
                isDraft: false,
                ...(projectId && { projectId }),
            },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                assignees: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Get classified tasks (Admin/Owner only)
    async findClassified() {
        return this.prisma.task.findMany({
            where: { classified: true },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                assignees: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Get all tasks for a project including drafts
    async findByProject(projectId: string) {
        return this.prisma.task.findMany({
            where: { projectId },
            include: {
                assignees: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: {
                project: true,
                assignees: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        return task;
    }

    async create(dto: CreateTaskDto) {
        const task = await this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                projectId: dto.projectId,
                status: dto.status,
                priority: dto.priority,
                deadline: dto.deadline ? new Date(dto.deadline) : undefined,
                classified: dto.classified ?? false,
                isDraft: dto.isDraft ?? false,
                assignees: dto.assigneeIds
                    ? { connect: dto.assigneeIds.map((id) => ({ id })) }
                    : undefined,
            },
            include: {
                assignees: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return task;
    }

    async update(id: string, dto: UpdateTaskDto) {
        const existingTask = await this.prisma.task.findUnique({
            where: { id },
        });

        if (!existingTask) {
            throw new NotFoundException('Task not found');
        }

        const task = await this.prisma.task.update({
            where: { id },
            data: {
                title: dto.title,
                description: dto.description,
                status: dto.status,
                priority: dto.priority,
                deadline: dto.deadline ? new Date(dto.deadline) : undefined,
                classified: dto.classified,
                isDraft: dto.isDraft,
                assignees: dto.assigneeIds
                    ? { set: dto.assigneeIds.map((id) => ({ id })) }
                    : undefined,
            },
            include: {
                assignees: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return task;
    }

    async remove(id: string) {
        const existingTask = await this.prisma.task.findUnique({
            where: { id },
        });

        if (!existingTask) {
            throw new NotFoundException('Task not found');
        }

        await this.prisma.task.delete({
            where: { id },
        });

        return { message: 'Task deleted successfully' };
    }
}
