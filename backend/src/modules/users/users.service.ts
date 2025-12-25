import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                team: true,
                phone: true,
                address: true,
                joinedAt: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return users;
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                team: true,
                phone: true,
                address: true,
                joinedAt: true,
                createdAt: true,
                projects: {
                    select: {
                        id: true,
                        title: true,
                        progress: true,
                    },
                },
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        priority: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async update(id: string, dto: UpdateUserDto) {
        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        const user = await this.prisma.user.update({
            where: { id },
            data: dto,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                team: true,
                phone: true,
                address: true,
                joinedAt: true,
            },
        });

        return user;
    }

    async remove(id: string) {
        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        await this.prisma.user.delete({
            where: { id },
        });

        return { message: 'User deleted successfully' };
    }
}
