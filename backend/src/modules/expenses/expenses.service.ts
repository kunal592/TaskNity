import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';

@Injectable()
export class ExpensesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.expense.findMany({
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
        return this.prisma.expense.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(userId: string, dto: CreateExpenseDto) {
        return this.prisma.expense.create({
            data: {
                userId,
                title: dto.title,
                category: dto.category,
                amount: dto.amount,
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

    async updateStatus(id: string, dto: UpdateExpenseDto) {
        const expense = await this.prisma.expense.findUnique({
            where: { id },
        });

        if (!expense) {
            throw new NotFoundException('Expense not found');
        }

        return this.prisma.expense.update({
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
