import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto, UpdateMeetingDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles, GetUser } from '../../common/decorators';
import { Role } from '@prisma/client';

@Controller('meetings')
@UseGuards(JwtAuthGuard)
export class MeetingsController {
    constructor(private meetingsService: MeetingsService) { }

    @Get()
    findAll() {
        return this.meetingsService.findAll();
    }

    @Get('upcoming')
    findUpcoming() {
        return this.meetingsService.findUpcoming();
    }

    @Get('my')
    findMyMeetings(@GetUser('id') userId: string) {
        return this.meetingsService.findMyMeetings(userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.meetingsService.findOne(id);
    }

    @Post()
    create(@GetUser('id') organizerId: string, @Body() dto: CreateMeetingDto) {
        return this.meetingsService.create(organizerId, dto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateMeetingDto) {
        return this.meetingsService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    delete(@Param('id') id: string) {
        return this.meetingsService.delete(id);
    }
}
