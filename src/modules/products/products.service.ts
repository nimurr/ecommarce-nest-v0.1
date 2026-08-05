import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/products.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    async createProduct(
        createProductDto: CreateProductDto,
        imageUrl?: string,
    ): Promise<ProductResponseDto> {
        const product = await this.prisma.product.create({
            data: {
                name: createProductDto.name,
                description: createProductDto.description ?? '',
                price: createProductDto.price,
                imageUrl: imageUrl,
                stock: createProductDto.stock,
                sku: createProductDto.sku,
                isActive: true,
                category: createProductDto.categoryId
                    ? { connect: { id: createProductDto.categoryId } }
                    : undefined,
            },
        });

        const response = new ProductResponseDto();
        response.id = product.id;
        response.name = product.name;
        response.description = product.description;
        response.price = product.price;
        response.imageUrl = product.imageUrl ?? undefined;
        response.stock = product.stock;
        response.sku = product.sku;
        response.categoryId = product.categoryId ?? undefined;

        return response;
    }
}