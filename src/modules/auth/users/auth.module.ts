import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from '../tokens/accessToken.strategy';
import { RefreshTokenStrategy } from '../tokens/refreshToken.strategy';

@Module({
    imports: [UserModule, JwtModule.register({})],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
