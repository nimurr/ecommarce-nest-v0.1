import {
    Body,
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/products.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { multerImageConfig } from 'src/common/utils/multer.config';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post('create')
   @UseInterceptors(FileInterceptor('imageUrl', multerImageConfig('products')))
    async createProduct(
        @Body() createProductDto: CreateProductDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<ProductResponseDto> {
        const imageUrl = file ? `/uploads/products/${file.filename}` : undefined;
        return this.productsService.createProduct(createProductDto, imageUrl);
    }
}