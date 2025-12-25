import { IsString, IsOptional, IsEnum, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    name?: string;

    @IsOptional()
    @IsString()
    team?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
