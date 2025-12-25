import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getDashboardKPIs() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        // Get counts
        const [
            totalUsers,
            totalProjects,
            totalTasks,
            completedTasks,
            inProgressTasks,
            todoTasks,
            pendingExpenses,
            approvedExpenses,
            pendingLeaves,
            attendanceToday,
            kudosThisMonth,
            meetingsThisWeek,
        ] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.project.count(),
            this.prisma.task.count({ where: { classified: false, isDraft: false } }),
            this.prisma.task.count({ where: { status: 'DONE', classified: false } }),
            this.prisma.task.count({ where: { status: 'IN_PROGRESS', classified: false } }),
            this.prisma.task.count({ where: { status: 'TODO', classified: false } }),
            this.prisma.expense.count({ where: { status: 'PENDING' } }),
            this.prisma.expense.aggregate({
                where: { status: 'APPROVED' },
                _sum: { amount: true },
            }),
            this.prisma.leave.count({ where: { status: 'PENDING' } }),
            this.prisma.attendance.count({
                where: {
                    date: { equals: new Date(now.toISOString().split('T')[0]) },
                },
            }),
            this.prisma.kudos.count({
                where: { createdAt: { gte: startOfMonth } },
            }),
            this.prisma.meeting.count({
                where: { startTime: { gte: startOfWeek } },
            }),
        ]);

        const completionRate = totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

        return {
            overview: {
                totalUsers,
                totalProjects,
                totalTasks,
                completionRate,
            },
            tasks: {
                completed: completedTasks,
                inProgress: inProgressTasks,
                todo: todoTasks,
            },
            expenses: {
                pending: pendingExpenses,
                totalApproved: approvedExpenses._sum.amount || 0,
            },
            leaves: {
                pending: pendingLeaves,
            },
            attendance: {
                today: attendanceToday,
            },
            engagement: {
                kudosThisMonth,
                meetingsThisWeek,
            },
        };
    }

    async getProductivityMetrics() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Tasks completed per day for last 30 days
        const tasksCompletedByDay = await this.prisma.task.groupBy({
            by: ['updatedAt'],
            where: {
                status: 'DONE',
                updatedAt: { gte: thirtyDaysAgo },
            },
            _count: true,
        });

        // Top performers (most tasks completed)
        const topPerformers = await this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                team: true,
                _count: {
                    select: { tasks: true },
                },
            },
            orderBy: {
                tasks: { _count: 'desc' },
            },
            take: 5,
        });

        // Project progress
        const projectProgress = await this.prisma.project.findMany({
            select: {
                id: true,
                title: true,
                progress: true,
                _count: {
                    select: { tasks: true, members: true },
                },
            },
            orderBy: { progress: 'desc' },
            take: 10,
        });

        return {
            taskVelocity: tasksCompletedByDay.length,
            topPerformers: topPerformers.map((u) => ({
                id: u.id,
                name: u.name,
                email: u.email,
                team: u.team,
                tasksAssigned: u._count.tasks,
            })),
            projectProgress: projectProgress.map((p) => ({
                id: p.id,
                title: p.title,
                progress: p.progress,
                taskCount: p._count.tasks,
                memberCount: p._count.members,
            })),
        };
    }

    async getAIInsights(userId: string) {
        // Get user's task data
        const userTasks = await this.prisma.task.findMany({
            where: {
                assignees: { some: { id: userId } },
            },
            select: {
                status: true,
                deadline: true,
                priority: true,
            },
        });

        const totalTasks = userTasks.length;
        const completedTasks = userTasks.filter((t) => t.status === 'DONE').length;
        const overdueTasks = userTasks.filter(
            (t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'DONE'
        ).length;
        const highPriorityPending = userTasks.filter(
            (t) => t.priority === 'HIGH' && t.status !== 'DONE'
        ).length;

        // Generate insights
        const insights: string[] = [];

        if (totalTasks > 0) {
            const completionRate = Math.round((completedTasks / totalTasks) * 100);

            if (completionRate >= 80) {
                insights.push("🌟 Excellent! You're maintaining an 80%+ completion rate.");
            } else if (completionRate >= 50) {
                insights.push(`📊 You've completed ${completionRate}% of your tasks. Keep pushing!`);
            } else {
                insights.push(`⚡ Focus mode: Only ${completionRate}% completion. Consider prioritizing.`);
            }
        }

        if (overdueTasks > 0) {
            insights.push(`⏰ ${overdueTasks} task(s) are overdue. Review deadlines.`);
        }

        if (highPriorityPending > 0) {
            insights.push(`🔥 ${highPriorityPending} high-priority task(s) need attention.`);
        }

        if (insights.length === 0) {
            insights.push("✨ All caught up! You're doing great.");
        }

        return {
            stats: {
                totalTasks,
                completedTasks,
                overdueTasks,
                highPriorityPending,
            },
            insights,
        };
    }
}
