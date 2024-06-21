import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { JwtModule } from '@nestjs/jwt';

import { UserController } from '../controllers/user.controller';
import { CarController } from '../controllers/car.controller';
import { OrderController } from 'src/controllers/order.controller';

import { PrismaService } from '../services/prisma.service';
import { UserService } from '../services/user.service';
import { CarService } from '../services/car.service';
import { OrderService } from 'src/services/order.service';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'public'),
        }),
        JwtModule.register({
            global: true,
            secret: process.env.SECRET_KEY,
            signOptions: { expiresIn: '60s' },
        }),
    ],
    controllers: [UserController, CarController, OrderController],
    providers: [PrismaService, UserService, CarService, OrderService],
})
export class AppModule {}
