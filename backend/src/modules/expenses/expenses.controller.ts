import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles, GetUser } from '../../common/decorators';
import { Role } from '@prisma/client';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
    constructor(private expensesService: ExpensesService) { }

    @Get()
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    findAll() {
        return this.expensesService.findAll();
    }

    @Get('my')
    findMy(@GetUser('id') userId: string) {
        return this.expensesService.findMy(userId);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN, Role.MEMBER)
    create(@GetUser('id') userId: string, @Body() dto: CreateExpenseDto) {
        return this.expensesService.create(userId, dto);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    updateStatus(@Param('id') id: string, @Body() dto: UpdateExpenseDto) {
        return this.expensesService.updateStatus(id, dto);
    }
}
