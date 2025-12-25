import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { KudosService } from './kudos.service';
import { CreateKudosDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';
import { GetUser } from '../../common/decorators';

@Controller('kudos')
@UseGuards(JwtAuthGuard)
export class KudosController {
    constructor(private kudosService: KudosService) { }

    @Get()
    findAll() {
        return this.kudosService.findAll();
    }

    @Get('leaderboard')
    getLeaderboard() {
        return this.kudosService.getLeaderboard();
    }

    @Get('user/:userId')
    findByUser(@Param('userId') userId: string) {
        return this.kudosService.findByUser(userId);
    }

    @Post()
    create(@GetUser('id') fromUserId: string, @Body() dto: CreateKudosDto) {
        return this.kudosService.create(fromUserId, dto);
    }
}
