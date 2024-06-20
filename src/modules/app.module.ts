import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { UserController } from '../controllers/user.controller';
import { CarController } from '../controllers/car.controller';

import { AppService } from '../services/app.service';
import { PrismaService } from '../services/prisma.service';
import { UserService } from '../services/user.service';
import { CarService } from '../services/car.service';

@Module({
  imports: [],
  controllers: [AppController, UserController, CarController],
  providers: [AppService, PrismaService, UserService, CarService],
})
export class AppModule {}
