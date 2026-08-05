import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthRegisterDto } from './dto/register.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private readonly SALT_ROUNDS = 12;

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async registerUser(registerDto: AuthRegisterDto): Promise<AuthResponseDto> {
        const { email, password, firstName, lastName } = registerDto;

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

        try {
            const newUser = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName: firstName ?? '',
                    lastName: lastName ?? '',
                },
            });

            // JWT fail korle eta throw kore fel dibe, kintu user already create hoye geche
            const tokens = await this.generateTokens(newUser.id, newUser.email, newUser.role);
            return tokens;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async loginUser(loginDto: AuthRegisterDto): Promise<AuthResponseDto> {
        const { email, password } = loginDto;

        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new ConflictException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new ConflictException('Invalid password');
        }

        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return tokens;
    }

    async getProfile(): Promise<string> {
        return 'Profile';
    }

    private async generateTokens(
        userId: string,
        email: string,
        role: Role,
    ): Promise<{ accessToken: string; refreshToken: string; user: { id: string; email: string; role: Role } }> {
        const payload = { sub: userId, email };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        } as any);

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        } as any);

        return { accessToken, refreshToken, user: { id: userId, email, role } };
    }
}