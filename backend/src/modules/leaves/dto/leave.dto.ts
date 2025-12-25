import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { RequestStatus } from '@prisma/client';

export class CreateLeaveDto {
    @IsString()
    reason: string;

    @IsDateString()
    date: string;
}

export class UpdateLeaveDto {
    @IsEnum(RequestStatus)
    status: RequestStatus;
}
