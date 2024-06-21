import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Order, Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}

    // возврат конкретного заказа
    async order(
        orderWhereUniqueInput: Prisma.OrderWhereUniqueInput,
    ): Promise<Order | null> {
        return this.prisma.order.findUnique({
            where: orderWhereUniqueInput,
        });
    }

    // возврат списка заказов
    async orders(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.OrderWhereUniqueInput;
        where?: Prisma.OrderWhereInput;
        orderBy?: Prisma.OrderOrderByWithRelationInput;
    }): Promise<Order[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.order.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    // добавление заказа
    async addOrder(data: Prisma.OrderCreateInput): Promise<Order> {
        return this.prisma.order.create({
            data,
        });
    }

    // обновление данных заказа
    async updateOrder(params: {
        where: Prisma.OrderWhereUniqueInput;
        data: Prisma.OrderUpdateInput;
    }): Promise<Order> {
        const { where, data } = params;
        return this.prisma.order.update({
            where,
            data,
        });
    }

    // удаление заказа
    async deleteOrder(where: Prisma.OrderWhereUniqueInput): Promise<Order> {
        return this.prisma.order.delete({
            where,
        });
    }
}
