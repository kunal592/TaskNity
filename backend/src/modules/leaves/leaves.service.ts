import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeaveDto, UpdateLeaveDto } from './dto';

@Injectable()
export class LeavesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.leave.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        team: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findMy(userId: string) {
        return this.prisma.leave.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(userId: string, dto: CreateLeaveDto) {
        return this.prisma.leave.create({
            data: {
                userId,
                reason: dto.reason,
                date: new Date(dto.date),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async updateStatus(id: string, dto: UpdateLeaveDto) {
        const leave = await this.prisma.leave.findUnique({
            where: { id },
        });

        if (!leave) {
            throw new NotFoundException('Leave request not found');
        }

        return this.prisma.leave.update({
            where: { id },
            data: { status: dto.status },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
}
