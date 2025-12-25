import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { Role } from '@prisma/client';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    async findAll(userId: string, userRole: Role) {
        // Owners and Admins see all projects
        if (userRole === Role.OWNER || userRole === Role.ADMIN) {
            return this.prisma.project.findMany({
                include: {
                    members: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                    _count: {
                        select: { tasks: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
        }

        // Members and Viewers see public projects + projects they are members of
        return this.prisma.project.findMany({
            where: {
                OR: [
                    { isPublic: true },
                    { members: { some: { id: userId } } },
                ],
            },
            include: {
                members: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
                _count: {
                    select: { tasks: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: {
                members: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        priority: true,
                        assignees: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    async create(dto: CreateProjectDto) {
        const project = await this.prisma.project.create({
            data: {
                title: dto.title,
                isPublic: dto.isPublic ?? true,
                members: dto.memberIds
                    ? { connect: dto.memberIds.map((id) => ({ id })) }
                    : undefined,
            },
            include: {
                members: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return project;
    }

    async update(id: string, dto: UpdateProjectDto) {
        // Check if project exists
        const existingProject = await this.prisma.project.findUnique({
            where: { id },
        });

        if (!existingProject) {
            throw new NotFoundException('Project not found');
        }

        const project = await this.prisma.project.update({
            where: { id },
            data: {
                title: dto.title,
                progress: dto.progress,
                isPublic: dto.isPublic,
                members: dto.memberIds
                    ? { set: dto.memberIds.map((id) => ({ id })) }
                    : undefined,
            },
            include: {
                members: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return project;
    }

    async remove(id: string) {
        const existingProject = await this.prisma.project.findUnique({
            where: { id },
        });

        if (!existingProject) {
            throw new NotFoundException('Project not found');
        }

        await this.prisma.project.delete({
            where: { id },
        });

        return { message: 'Project deleted successfully' };
    }
}
