# Ecommerce Backend (NestJS + Prisma + PostgreSQL)

A NestJS-based ecommerce backend using Prisma ORM with PostgreSQL (Neon), JWT authentication, and a modular architecture.

## Tech Stack

- **Framework:** NestJS
- **ORM:** Prisma (with `@prisma/adapter-pg`)
- **Database:** PostgreSQL (Neon)
- **Auth:** JWT (`@nestjs/jwt`)
- **Validation:** class-validator / class-transformer
- **Password Hashing:** bcrypt

---

## 1. Installation

```bash
# Install NestJS CLI globally
npm i -g @nestjs/cli

# Create a new project
nest new project-name

# Install Prisma and PostgreSQL adapter
npm i prisma@latest @prisma/client@latest @prisma/config @prisma/adapter-pg pg

# Install JWT and validation packages
npm i @nestjs/jwt
npm i class-validator class-transformer
npm i bcrypt
npm i -D @types/bcrypt

# Install env config support
npm i @nestjs/config
```

---

## 2. Environment Setup

Create a `.env` file in the project root:

```dotenv
PORT=3000

# Mode: development | production
NODE_ENV=development

# PostgreSQL connection string (Neon)
DATABASE_URL="postgresql://username:password@your-neon-host/dbname?sslmode=require"

# JWT secrets (generate with the command below)
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

Generate strong random secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run this command twice — once for `JWT_ACCESS_SECRET`, once for `JWT_REFRESH_SECRET`.

Register `ConfigModule` in `app.module.ts` so `.env` values are loaded:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // other modules...
  ],
})
export class AppModule {}
```

---

## 3. Connect Prisma with PostgreSQL

```bash
# Initialize Prisma
npx prisma init
```

Steps:
1. Connect the DB using `DATABASE_URL` in `.env`
2. Design your database schema in `prisma/schema.prisma`
3. Run the first migration:

```bash
npx prisma migrate dev --name init
```

---

## 4. Prisma Module Setup

```bash
npx nest g module prisma
npx nest g service prisma
```

**`src/prisma/prisma.service.ts`**

```typescript
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    constructor() {
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL,
        });

        super({
            adapter,
            log: process.env.NODE_ENV === 'development'
                ? ['query', 'info', 'warn', 'error']
                : ['error'],
        });
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
```

**`src/prisma/prisma.module.ts`** (make it global so it doesn't need to be re-imported in every module)

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule {}
```

Import it once in `app.module.ts`:

```typescript
imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true })],
```

Generate the client and run the server:

```bash
npx prisma generate
npm run start:dev
```

---

## 5. Creating a Feature Module (Example: Auth)

```bash
npx nest g module modules/auth
npx nest g service modules/auth
npx nest g controller modules/auth
```

Repeat the same pattern for other features (e.g. `modules/orders`, `modules/products`):

```bash
npx nest g module modules/orders
npx nest g service modules/orders
npx nest g controller modules/orders
```

---

## 6. Running the Project

```bash
# Development (watch mode)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

---

## 7. Useful Prisma Commands

| Command | Description |
|---|---|
| `npx prisma init` | Initialize Prisma in the project |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma migrate dev --name <name>` | Create and apply a migration |
| `npx prisma studio` | Open Prisma Studio (DB GUI) |

---

## Notes

- SSL mode `sslmode=require` is used for the Neon connection string. For libpq-compatible strict SSL behavior, use `uselibpqcompat=true&sslmode=require` instead.
- `PrismaModule` is marked `@Global()` so `PrismaService` is available across all modules without repeated imports.
- Never commit `.env` to version control — add it to `.gitignore`.