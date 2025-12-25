import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateKudosDto } from './dto';

@Injectable()
export class KudosService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.kudos.findMany({
            include: {
                fromUser: {
                    select: { id: true, name: true, email: true, team: true },
                },
                toUser: {
                    select: { id: true, name: true, email: true, team: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 50, // Last 50 kudos
        });
    }

    async findByUser(userId: string) {
        return this.prisma.kudos.findMany({
            where: {
                OR: [{ fromUserId: userId }, { toUserId: userId }],
            },
            include: {
                fromUser: {
                    select: { id: true, name: true, email: true },
                },
                toUser: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getLeaderboard() {
        // Get users with most kudos received
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                team: true,
                _count: {
                    select: { kudosReceived: true },
                },
            },
            orderBy: {
                kudosReceived: { _count: 'desc' },
            },
            take: 10,
        });

        return users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            team: u.team,
            kudosCount: u._count.kudosReceived,
        }));
    }

    async create(fromUserId: string, dto: CreateKudosDto) {
        return this.prisma.kudos.create({
            data: {
                fromUserId,
                toUserId: dto.toUserId,
                message: dto.message,
                emoji: dto.emoji || '🎉',
            },
            include: {
                fromUser: {
                    select: { id: true, name: true, email: true },
                },
                toUser: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }
}
