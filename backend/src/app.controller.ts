import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  healthCheck() {
    return {
      status: 'ok',
      message: 'TaskNity API is running',
      version: '1.1.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: '/api/auth/login, /api/auth/register, /api/auth/me',
        users: '/api/users',
        projects: '/api/projects',
        tasks: '/api/tasks',
        attendance: '/api/attendance',
        leaves: '/api/leaves',
        expenses: '/api/expenses',
        kudos: '/api/kudos, /api/kudos/leaderboard',
        meetings: '/api/meetings, /api/meetings/upcoming',
        analytics: '/api/analytics/kpis, /api/analytics/insights',
      },
    };
  }
}
