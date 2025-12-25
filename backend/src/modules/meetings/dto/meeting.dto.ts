import { IsString, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreateMeetingDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsDateString()
    startTime: string;

    @IsDateString()
    endTime: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    link?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    attendeeIds?: string[];
}

export class UpdateMeetingDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDateString()
    startTime?: string;

    @IsOptional()
    @IsDateString()
    endTime?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    link?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    attendeeIds?: string[];
}
