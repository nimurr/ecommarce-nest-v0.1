import { IsString, IsNumber, IsOptional, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price!: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    stock!: number;

    @IsString()
    @IsNotEmpty()
    sku!: string;

    @IsString()
    @IsOptional()
    categoryId?: string;
}