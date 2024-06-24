import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';

import { CarController } from '../controllers/car.controller';
import { OrderController } from '../controllers/order.controller';

import { PrismaService } from '../services/prisma.service';
import { CarService } from '../services/car.service';
import { OrderService } from '../services/order.service';
import { UserModule } from './auth/user.module';

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
