import {
    Controller,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles, GetUser } from '../../common/decorators';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN, Role.MEMBER)
    findAll() {
        return this.usersService.findAll();
    }

    @Get('me')
    getMyProfile(@GetUser('id') userId: string) {
        return this.usersService.findOne(userId);
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN, Role.MEMBER)
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.usersService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
