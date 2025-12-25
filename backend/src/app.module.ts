import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

// Core Modules
import { PrismaModule } from './prisma/prisma.module';
import { AllExceptionsFilter } from './common/filters';
import { AppController } from './app.controller';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { LeavesModule } from './modules/leaves/leaves.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { KudosModule } from './modules/kudos/kudos.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { InvoicesModule } from './modules/invoices/invoices.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    PrismaModule,

    // Feature Modules
    AuthModule,
    UsersModule,
    ProjectsModule,
    TasksModule,
    AttendanceModule,
    LeavesModule,
    ExpensesModule,
    KudosModule,
    MeetingsModule,
    AnalyticsModule,
    InvoicesModule,
  ],
  controllers: [AppController],
  providers: [
    // Global Exception Filter
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule { }
