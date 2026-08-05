import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule , ProductsModule],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule { }