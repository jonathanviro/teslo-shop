import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive } from "class-validator";

export class PaginationDto {
    
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type( () => Number)
    limit?: number;

    @IsOptional()
    @IsInt()
    @Type( () => Number)
    offset?: number;
}