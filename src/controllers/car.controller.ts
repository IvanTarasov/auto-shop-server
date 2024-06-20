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
    ParseIntPipe
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { CarService } from '../services/car.service';
  import { $Enums, Car as CarModel} from '@prisma/client';
  import { Express } from 'express';
  import { randomUUID, UUID } from 'crypto';
  import { diskStorage } from 'multer';
import { AddCarDto } from '../dto/addCar.dto';
  
  @Controller()
  export class CarController {
    constructor(
      private readonly carService: CarService,
    ) {}
  
    @Post('car')
    @UseInterceptors(FileInterceptor('file',
        {
            storage: diskStorage({
              destination: './uploads'
              , filename: (req, file, cb) => {
                cb(null, `${randomUUID()}.jpg`)
              }
            })
          }
    ))
    async addCar(
      @Body() carData: AddCarDto,
      @UploadedFile() file: Express.Multer.File
    ): Promise<CarModel> {
        return this.carService.addCar({name: carData.name, price: carData.price, year: carData.year, description: carData.description, status: carData.status, type:carData.type, img: file.filename});
    }
  }