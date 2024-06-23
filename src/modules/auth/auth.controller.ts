import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingInDto } from '../../dto/singIn.dto';
import { RegistrationDto } from '../../dto/registration.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: SingInDto) {
        return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @HttpCode(HttpStatus.OK)
    @Post('registration')
    async registration(
        @Body()
        registerDto: RegistrationDto,
    ): Promise<{ access_token: string }> {
        return this.authService.register(
            registerDto.name,
            registerDto.email,
            registerDto.password,
            registerDto.phone,
        );
    }
}
