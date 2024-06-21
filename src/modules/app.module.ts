import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { UserController } from '../controllers/user.controller';
import { CarController } from '../controllers/car.controller';

import { PrismaService } from '../services/prisma.service';
import { UserService } from '../services/user.service';
import { CarService } from '../services/car.service';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'public'),
        }),
    ],
    controllers: [UserController, CarController],
    providers: [PrismaService, UserService, CarService],
})
export class AppModule {}
