import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMeetingDto, UpdateMeetingDto } from './dto';

@Injectable()
export class MeetingsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.meeting.findMany({
            include: {
                organizer: {
                    select: { id: true, name: true, email: true },
                },
                attendees: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { startTime: 'asc' },
        });
    }

    async findUpcoming() {
        const now = new Date();
        return this.prisma.meeting.findMany({
            where: {
                startTime: { gte: now },
            },
            include: {
                organizer: {
                    select: { id: true, name: true, email: true },
                },
                attendees: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { startTime: 'asc' },
            take: 20,
        });
    }

    async findMyMeetings(userId: string) {
        return this.prisma.meeting.findMany({
            where: {
                OR: [
                    { organizerId: userId },
                    { attendees: { some: { id: userId } } },
                ],
            },
            include: {
                organizer: {
                    select: { id: true, name: true, email: true },
                },
                attendees: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { startTime: 'asc' },
        });
    }

    async findOne(id: string) {
        const meeting = await this.prisma.meeting.findUnique({
            where: { id },
            include: {
                organizer: {
                    select: { id: true, name: true, email: true },
                },
                attendees: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        if (!meeting) {
            throw new NotFoundException('Meeting not found');
        }

        return meeting;
    }

    async create(organizerId: string, dto: CreateMeetingDto) {
        return this.prisma.meeting.create({
            data: {
                title: dto.title,
                description: dto.description,
                startTime: new Date(dto.startTime),
                endTime: new Date(dto.endTime),
                location: dto.location,
                link: dto.link,
                organizerId,
                attendees: dto.attendeeIds
                    ? { connect: dto.attendeeIds.map((id) => ({ id })) }
                    : undefined,
            },
            include: {
                organizer: {
                    select: { id: true, name: true, email: true },
                },
                attendees: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }

    async update(id: string, dto: UpdateMeetingDto) {
        const existing = await this.prisma.meeting.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException('Meeting not found');
        }

        return this.prisma.meeting.update({
            where: { id },
            data: {
                title: dto.title,
                description: dto.description,
                startTime: dto.startTime ? new Date(dto.startTime) : undefined,
                endTime: dto.endTime ? new Date(dto.endTime) : undefined,
                location: dto.location,
                link: dto.link,
                attendees: dto.attendeeIds
                    ? { set: dto.attendeeIds.map((id) => ({ id })) }
                    : undefined,
            },
            include: {
                organizer: {
                    select: { id: true, name: true, email: true },
                },
                attendees: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }

    async delete(id: string) {
        const existing = await this.prisma.meeting.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException('Meeting not found');
        }

        await this.prisma.meeting.delete({ where: { id } });
        return { message: 'Meeting deleted successfully' };
    }
}
