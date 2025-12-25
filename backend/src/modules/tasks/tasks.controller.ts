import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles } from '../../common/decorators';
import { Role } from '@prisma/client';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Get()
    findAll(@Query('projectId') projectId?: string) {
        return this.tasksService.findAll(projectId);
    }

    @Get('classified')
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    findClassified() {
        return this.tasksService.findClassified();
    }

    @Get('project/:projectId')
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN, Role.MEMBER)
    findByProject(@Param('projectId') projectId: string) {
        return this.tasksService.findByProject(projectId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tasksService.findOne(id);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN, Role.MEMBER)
    create(@Body() dto: CreateTaskDto) {
        return this.tasksService.create(dto);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN, Role.MEMBER)
    update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
        return this.tasksService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.tasksService.remove(id);
    }
}
