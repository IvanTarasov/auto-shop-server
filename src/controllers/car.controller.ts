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
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { CarService } from '../services/car.service'
import { $Enums, Car as CarModel, Prisma } from '@prisma/client'
import { Express } from 'express'
import { randomUUID, UUID } from 'crypto'
import { diskStorage } from 'multer'
import { AddCarDto } from '../dto/addCar.dto'

@Controller()
export class CarController {
    constructor(private readonly carService: CarService) {}

    @Post('car')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    cb(null, `${randomUUID()}.jpg`)
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
        })
    }

    @Get('car/:id')
    async getCarById(@Param('id') id: string): Promise<CarModel> {
        return this.carService.car({ id: Number(id) })
    }

    @Get('car')
    async getCars(
        @Query('status') status?: $Enums.CarStatus,
        @Query('type') type?: $Enums.CarType,
        @Query('order') order?: Prisma.SortOrder,
    ): Promise<CarModel[]> {
        if (order) {
            if (status && type) {
                return (
                    await this.carService.cars({
                        where: { status, type },
                        orderBy: { price: order },
                    })
                ).sort()
            }
            if (!status && !type) {
                return (
                    await this.carService.cars({ orderBy: { price: order } })
                ).sort()
            }
            if (!status && type) {
                return (
                    await this.carService.cars({
                        where: { type },
                        orderBy: { price: order },
                    })
                ).sort()
            }
            if (status && !type) {
                return (
                    await this.carService.cars({
                        where: { status },
                        orderBy: { price: order },
                    })
                ).sort()
            }
        } else {
            if (status && type) {
                return (
                    await this.carService.cars({ where: { status, type } })
                ).sort()
            }
            if (!status && !type) {
                return (await this.carService.cars({})).sort()
            }
            if (!status && type) {
                return (await this.carService.cars({ where: { type } })).sort()
            }
            if (status && !type) {
                return (
                    await this.carService.cars({ where: { status } })
                ).sort()
            }
        }
    }
}
