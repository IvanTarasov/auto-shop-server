import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    @Post('registration')
    async registration(
        @Body()
        userData: {
            email: string;
            name: string;
            password: string;
            phone: string;
        },
    ): Promise<{ access_token: string }> {
        const hash = await bcrypt.hash(userData.password, 10);
        userData.password = hash;
        const user = await this.userService.createUser(userData);
        const { password, ...result } = user;
        return {
            access_token: await this.jwtService.signAsync(result),
        };
    }

    @Post('login')
    async login(
        @Body()
        userData: {
            email: string;
            password: string;
        },
    ): Promise<{ access_token: string }> {
        const user = await this.userService.user({ email: userData.email });
        const isMatch = await bcrypt.compare(userData.password, user?.password);
        if (!isMatch) {
            throw new UnauthorizedException();
        }
        const { password, ...result } = user;
        return {
            access_token: await this.jwtService.signAsync(result),
        };
    }
}
