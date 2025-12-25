import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class CreateAttendanceDto {
    @IsEnum(AttendanceStatus)
    status: AttendanceStatus;

    @IsOptional()
    @IsDateString()
    date?: string; // Defaults to today
}
