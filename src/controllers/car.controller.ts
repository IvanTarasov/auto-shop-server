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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CarService } from '../services/car.service';
import { $Enums, Car as CarModel, Prisma } from '@prisma/client';
import { Express } from 'express';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { AddCarDto } from '../dto/addCar.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller()
export class CarController {
    constructor(private readonly carService: CarService) {}

    @Roles($Enums.Role.ADMIN)
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
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
        @Body() carData: AddCarDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<CarModel> {
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

    @Roles($Enums.Role.ADMIN)
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
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

    @Get('car/:id')
    async getCarById(@Param('id') id: string): Promise<CarModel> {
        return this.carService.car({ id: Number(id) });
    }

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

    @Roles($Enums.Role.ADMIN)
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @Delete('car/:id')
    async deleteCar(@Param('id') id: string): Promise<CarModel> {
        return this.carService.deleteCar({ id: Number(id) });
    }
}
