import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAttendanceDto } from './dto';

@Injectable()
export class AttendanceService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.attendance.findMany({
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
            orderBy: { date: 'desc' },
        });
    }

    async findByUser(userId: string) {
        return this.prisma.attendance.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
        });
    }

    async findToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.prisma.attendance.findMany({
            where: {
                date: today,
            },
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
        });
    }

    async markAttendance(userId: string, dto: CreateAttendanceDto) {
        const date = dto.date ? new Date(dto.date) : new Date();
        date.setHours(0, 0, 0, 0);

        // Check if attendance already marked for today
        const existing = await this.prisma.attendance.findUnique({
            where: {
                userId_date: {
                    userId,
                    date,
                },
            },
        });

        if (existing) {
            throw new ConflictException('Attendance already marked for this date');
        }

        return this.prisma.attendance.create({
            data: {
                userId,
                date,
                status: dto.status,
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
}
