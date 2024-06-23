import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async signIn(
        email: string,
        pass: string,
    ): Promise<{ access_token: string }> {
        const user = await this.userService.user({ email: email });
        const isMatch = await bcrypt.compare(pass, user?.password);
        if (!isMatch) {
            throw new UnauthorizedException('Неверный логин или пароль');
        }
        const { password, ...result } = user;
        return {
            access_token: await this.jwtService.signAsync(result),
        };
    }

    async register(
        name: string,
        email: string,
        pass: string,
        phone: string,
    ): Promise<{ access_token: string }> {
        try {
            pass = await bcrypt.hash(pass, 10);
            const user = await this.userService.createUser({
                name: name,
                email: email,
                password: pass,
                phone: phone,
            });

            const { password, ...result } = user;
            return {
                access_token: await this.jwtService.signAsync(result),
            };
        } catch {
            throw new UnauthorizedException(
                'Пользователь с таким email уже существует',
            );
        }
    }
}
