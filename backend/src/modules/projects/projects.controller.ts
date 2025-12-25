import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles, GetUser } from '../../common/decorators';
import { Role } from '@prisma/client';
import type { User } from '@prisma/client';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
    constructor(private projectsService: ProjectsService) { }

    @Get()
    findAll(@GetUser() user: User) {
        return this.projectsService.findAll(user.id, user.role);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectsService.findOne(id);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    create(@Body() dto: CreateProjectDto) {
        return this.projectsService.create(dto);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
        return this.projectsService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.projectsService.remove(id);
    }
}
