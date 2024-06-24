import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    SetMetadata,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Ошибка доступа');
        }
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.SECRET_KEY,
            });
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException('Ошибка доступа');
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
