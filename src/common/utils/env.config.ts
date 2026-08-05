// src/config/env.config.ts
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

export interface EnvConfig {
    PORT: number;
    NODE_ENV: 'development' | 'production' | 'test';
    DATABASE_URL: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRES_IN: string;
    JWT_REFRESH_EXPIRES_IN: string;
}

const envVariables: EnvConfig = {
    PORT: Number(process.env.PORT) || 3000,
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    DATABASE_URL: requireEnv('DATABASE_URL'),
    JWT_ACCESS_SECRET: requireEnv('JWT_ACCESS_SECRET'),
    JWT_REFRESH_SECRET: requireEnv('JWT_REFRESH_SECRET'),
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};

export default envVariables;