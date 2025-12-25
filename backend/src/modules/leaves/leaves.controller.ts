import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { CreateLeaveDto, UpdateLeaveDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles, GetUser } from '../../common/decorators';
import { Role } from '@prisma/client';

@Controller('leaves')
@UseGuards(JwtAuthGuard)
export class LeavesController {
    constructor(private leavesService: LeavesService) { }

    @Get()
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    findAll() {
        return this.leavesService.findAll();
    }

    @Get('my')
    findMy(@GetUser('id') userId: string) {
        return this.leavesService.findMy(userId);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN, Role.MEMBER)
    create(@GetUser('id') userId: string, @Body() dto: CreateLeaveDto) {
        return this.leavesService.create(userId, dto);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    updateStatus(@Param('id') id: string, @Body() dto: UpdateLeaveDto) {
        return this.leavesService.updateStatus(id, dto);
    }
}
