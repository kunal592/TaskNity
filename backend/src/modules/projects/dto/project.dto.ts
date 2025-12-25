import { IsString, IsOptional, IsBoolean, IsArray, IsInt, Min, Max } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    memberIds?: string[];
}

export class UpdateProjectDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    progress?: number;

    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    memberIds?: string[];
}
