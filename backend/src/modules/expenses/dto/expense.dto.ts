import { IsString, IsNumber, IsDateString, IsOptional, IsEnum, Min } from 'class-validator';
import { RequestStatus } from '@prisma/client';

export class CreateExpenseDto {
    @IsString()
    title: string;

    @IsString()
    category: string;

    @IsNumber()
    @Min(0)
    amount: number;

    @IsDateString()
    date: string;
}

export class UpdateExpenseDto {
    @IsEnum(RequestStatus)
    status: RequestStatus;
}
