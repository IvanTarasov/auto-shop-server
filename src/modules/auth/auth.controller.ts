import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    Get,
    Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingInDto } from '../../dto/singIn.dto';
import { RegistrationDto } from '../../dto/registration.dto';
import { Request } from 'express';
import { AccessTokenGuard } from './accessToken.guard';
import { RefreshTokenGuard } from './refreshToken.guard';

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

    @UseGuards(AccessTokenGuard)
    @Get('logout')
    async logout(@Req() req: Request): Promise<any> {
        return this.authService.logout(req.user['id']);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    async refreshTokens(@Req() req: Request): Promise<any> {
        const userId = req.user['id'];
        const refreshToken = req.user['refreshToken'];
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
