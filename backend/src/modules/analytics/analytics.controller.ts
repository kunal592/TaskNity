import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles, GetUser } from '../../common/decorators';
import { Role } from '@prisma/client';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) { }

    @Get('kpis')
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    getDashboardKPIs() {
        return this.analyticsService.getDashboardKPIs();
    }

    @Get('productivity')
    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    getProductivityMetrics() {
        return this.analyticsService.getProductivityMetrics();
    }

    @Get('insights')
    getAIInsights(@GetUser('id') userId: string) {
        return this.analyticsService.getAIInsights(userId);
    }
}
