import { IsString, IsOptional } from 'class-validator';

export class CreateKudosDto {
    @IsString()
    toUserId: string;

    @IsString()
    message: string;

    @IsOptional()
    @IsString()
    emoji?: string;
}
