import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthGuard } from './dto/auth.guard';
import { GetUser } from './decorators/get-user.decorator';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async registerUser(@Body() registerDto: AuthRegisterDto): Promise<AuthResponseDto> {
        return this.authService.registerUser(registerDto);
    }

    @Post('login')
    async loginUser(@Body() loginDto: AuthRegisterDto): Promise<AuthResponseDto> {
        return this.authService.loginUser(loginDto);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@GetUser('sub') userId: string) {
        return this.authService.getProfile(userId);
    }
}