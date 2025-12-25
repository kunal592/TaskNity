import {
    IsString,
    IsOptional,
    IsBoolean,
    IsArray,
    IsEnum,
    IsDateString,
} from 'class-validator';
import { TaskStatus, Priority } from '@prisma/client';

export class CreateTaskDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    projectId: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    @IsEnum(Priority)
    priority?: Priority;

    @IsOptional()
    @IsDateString()
    deadline?: string;

    @IsOptional()
    @IsBoolean()
    classified?: boolean;

    @IsOptional()
    @IsBoolean()
    isDraft?: boolean;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    assigneeIds?: string[];
}

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    @IsEnum(Priority)
    priority?: Priority;

    @IsOptional()
    @IsDateString()
    deadline?: string;

    @IsOptional()
    @IsBoolean()
    classified?: boolean;

    @IsOptional()
    @IsBoolean()
    isDraft?: boolean;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    assigneeIds?: string[];
}
