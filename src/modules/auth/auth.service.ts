import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.userService.user({ email: email });
        const isMatch = await bcrypt.compare(pass, user?.password);
        if (!isMatch) {
            throw new UnauthorizedException('Неверный логин или пароль');
        }
        const tokens = await this.getTokens({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        });
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async register(
        name: string,
        email: string,
        pass: string,
        phone: string,
    ): Promise<any> {
        try {
            pass = await bcrypt.hash(pass, 10);
            const user = await this.userService.createUser({
                name: name,
                email: email,
                password: pass,
                phone: phone,
            });

            const tokens = await this.getTokens({
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            });
            await this.updateRefreshToken(user.id, tokens.refreshToken);
            return tokens;
        } catch {
            throw new UnauthorizedException(
                'Пользователь с таким email уже существует',
            );
        }
    }

    async logout(userId: string) {
        await this.userService.updateUser({
            where: { id: Number(userId) },
            data: { refreshToken: 'none' },
        });
        return 'Success logout';
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.userService.user({ id: Number(userId) });
        if (!user || !user.refreshToken)
            throw new ForbiddenException('Access Denied');
        const refreshTokenMatches = await bcrypt.compare(
            refreshToken,
            user.refreshToken,
        );
        console.log(refreshTokenMatches);
        console.log(refreshToken);
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        });
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userService.updateUser({
            where: { id: userId },
            data: { refreshToken: hashedRefreshToken },
        });
    }

    async getTokens(payload: any) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
}
