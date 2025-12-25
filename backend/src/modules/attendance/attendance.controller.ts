import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles, GetUser } from '../../common/decorators';
import { Role } from '@prisma/client';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
    constructor(private attendanceService: AttendanceService) { }

    @Get()
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    findAll() {
        return this.attendanceService.findAll();
    }

    @Get('today')
    findToday() {
        return this.attendanceService.findToday();
    }

    @Get('my')
    findMy(@GetUser('id') userId: string) {
        return this.attendanceService.findByUser(userId);
    }

    @Get('user/:userId')
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    findByUser(@Param('userId') userId: string) {
        return this.attendanceService.findByUser(userId);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN, Role.MEMBER)
    markAttendance(
        @GetUser('id') userId: string,
        @Body() dto: CreateAttendanceDto,
    ) {
        return this.attendanceService.markAttendance(userId, dto);
    }
}
