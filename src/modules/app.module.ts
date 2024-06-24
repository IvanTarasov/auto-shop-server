import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './auth/users/auth.module';

import { CarController } from './cars/car.controller';
import { OrderController } from './orders/order.controller';

import { PrismaService } from '../orm-service/prisma.service';
import { CarService } from '../modules/cars/car.service';
import { OrderService } from '../modules/orders/order.service';
import { UserModule } from '../modules/auth/users/user.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'public'),
        }),
    ],
    controllers: [CarController, OrderController],
    providers: [PrismaService, CarService, OrderService],
})
export class AppModule {}
