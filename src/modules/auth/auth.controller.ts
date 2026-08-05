import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

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

    @Get('profile')
    async getProfile(): Promise<string> {
        return this.authService.getProfile();
    }

 

}
