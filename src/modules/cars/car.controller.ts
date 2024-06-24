import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete,
    UseInterceptors,
    UploadedFile,
    Query,
    UseGuards,
    SetMetadata,
    Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CarService } from '../cars/car.service';
import { $Enums, Car as CarModel, Prisma } from '@prisma/client';
import { Express } from 'express';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { AddCarDto } from './addCar.dto';
import { AccessTokenGuard } from '../auth/tokens/accessToken.guard';
import { RolesGuard } from '../auth/users/roles.guard';
import { Request } from 'express';

@Controller()
export class CarController {
    constructor(private readonly carService: CarService) {}

    @SetMetadata('roles', ['ADMIN', 'USER'])
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Post('car')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './public',
                filename: (req, file, cb) => {
                    cb(null, `${randomUUID()}.jpg`);
                },
            }),
        }),
    )
    async addCar(
        @Req() request: Request,
        @Body() carData: AddCarDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<CarModel> {
        if (request['user'] === 'USER') {
            carData.status = 'PROCESSED';
        }
        return this.carService.addCar({
            name: carData.name,
            price: carData.price,
            year: carData.year,
            description: carData.description,
            status: carData.status,
            type: carData.type,
            img: file.filename,
        });
    }

    @SetMetadata('roles', ['ADMIN'])
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Put('car/:id')
    async changeStatus(
        @Param('id') id: string,
        @Query('status') status: $Enums.CarStatus,
    ): Promise<CarModel> {
        return this.carService.updateCar({
            where: { id: Number(id) },
            data: { status: status },
        });
    }

    @SetMetadata('roles', ['ADMIN'])
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Get('car/:id')
    async getCarById(@Param('id') id: string): Promise<CarModel> {
        return this.carService.car({ id: Number(id) });
    }

    @Get('exp-car/:id')
    async getExposedCarById(@Param('id') id: string): Promise<CarModel> {
        return this.carService.car({ id: Number(id), status: 'EXPOSED' });
    }

    @SetMetadata('roles', ['ADMIN'])
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Get('car')
    async getCars(
        @Query('status') status?: $Enums.CarStatus,
        @Query('type') type?: $Enums.CarType,
        @Query('order') order?: Prisma.SortOrder,
    ): Promise<CarModel[]> {
        if (order) {
            if (status && type) {
                return await this.carService.cars({
                    where: { status, type },
                    orderBy: { price: order },
                });
            }
            if (!status && !type) {
                return await this.carService.cars({
                    orderBy: { price: order },
                });
            }
            if (!status && type) {
                return await this.carService.cars({
                    where: { type },
                    orderBy: { price: order },
                });
            }
            if (status && !type) {
                return await this.carService.cars({
                    where: { status },
                    orderBy: { price: order },
                });
            }
        } else {
            if (status && type) {
                return await this.carService.cars({ where: { status, type } });
            }
            if (!status && !type) {
                return await this.carService.cars({});
            }
            if (!status && type) {
                return await this.carService.cars({ where: { type } });
            }
            if (status && !type) {
                return await this.carService.cars({ where: { status } });
            }
        }
    }

    @Get('exp-car')
    async getExposedCars(
        @Query('type') type?: $Enums.CarType,
        @Query('order') order?: Prisma.SortOrder,
    ): Promise<CarModel[]> {
        if (order) {
            if (type) {
                return await this.carService.cars({
                    where: { status: 'EXPOSED', type },
                    orderBy: { price: order },
                });
            }
            if (!type) {
                return await this.carService.cars({
                    where: { status: 'EXPOSED' },
                    orderBy: { price: order },
                });
            }
        } else {
            if (type) {
                return await this.carService.cars({
                    where: { status: 'EXPOSED', type },
                });
            }
            if (!type) {
                return await this.carService.cars({
                    where: { status: 'EXPOSED' },
                });
            }
        }
    }

    @SetMetadata('roles', ['ADMIN'])
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Delete('car/:id')
    async deleteCar(@Param('id') id: string): Promise<CarModel> {
        return this.carService.deleteCar({ id: Number(id) });
    }
}
