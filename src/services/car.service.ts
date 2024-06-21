import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Car, Prisma } from '@prisma/client';
import { unlink } from 'fs';

@Injectable()
export class CarService {
    constructor(private prisma: PrismaService) {}

    // возврат конкретного автомобиля
    async car(
        carWhereUniqueInput: Prisma.CarWhereUniqueInput,
    ): Promise<Car | null> {
        return this.prisma.car.findUnique({
            where: carWhereUniqueInput,
        });
    }

    // возврат списка автомобилей
    async cars(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.CarWhereUniqueInput;
        where?: Prisma.CarWhereInput;
        orderBy?: Prisma.CarOrderByWithRelationInput;
    }): Promise<Car[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.car.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    // добавление автомобиля
    async addCar(data: Prisma.CarCreateInput): Promise<Car> {
        return this.prisma.car.create({
            data,
        });
    }

    // обновление данных автомобиля
    async updateCar(params: {
        where: Prisma.CarWhereUniqueInput;
        data: Prisma.CarUpdateInput;
    }): Promise<Car> {
        const { where, data } = params;
        return this.prisma.car.update({
            where,
            data,
        });
    }

    // удаление автомобиля
    async deleteCar(where: Prisma.CarWhereUniqueInput): Promise<Car> {
        const delCar = await this.prisma.car.delete({
            where,
        });
        unlink('./public/' + delCar.img, (err) => {});
        return delCar;
    }
}
