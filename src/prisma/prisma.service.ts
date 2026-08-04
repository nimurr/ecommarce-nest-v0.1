import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    constructor() {
        console.log('DATABASE_URL:', process.env.DATABASE_URL);
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL,
        });
        super({
            adapter,
            log: process.env.NODE_ENV === 'development' ?
                ['query', 'info', 'warn', 'error']
                : ['error'],
        })
    }

    async onModuleInit() {
        await this.$connect();
        console.log('✅ Database connected successfully');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        console.log('⚠️ Database disconnected successfully');
    }

    async cleanDatabase() {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Cannot clean database in production');
        }

        const models = Reflect.ownKeys(this).filter((key) => {
            return typeof key === 'string' && key[0] !== '_' && key[0] !== '$';
        });

        return Promise.all(
            models.map((modelKey) => {
                return (this as any)[modelKey].deleteMany();
            }),
        );
    }



}
