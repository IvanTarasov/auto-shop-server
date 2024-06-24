import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete,
    Query,
    UseGuards,
    SetMetadata,
} from '@nestjs/common';
import { OrderService } from '../orders/order.service';
import { $Enums, Order as OrderModel, Prisma } from '@prisma/client';
import { AddOrderDto } from './addOrder.dto';
import { AccessTokenGuard } from '../auth/tokens/accessToken.guard';
import { RolesGuard } from '../auth/users/roles.guard';

@Controller()
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @SetMetadata('roles', ['ADMIN', 'USER'])
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Post('order')
    async addOrder(@Body() orderData: AddOrderDto): Promise<OrderModel> {
        return await this.orderService.addOrder({
            user: { connect: { id: orderData.userId } },
            car: { connect: { id: orderData.carId } },
            type: orderData.type,
        });
    }

    @SetMetadata('roles', ['ADMIN'])
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Put('order/:id')
    async changeStatus(
        @Param('id') id: string,
        @Query('status') status: $Enums.OrderStatus,
    ): Promise<OrderModel> {
        return await this.orderService.updateOrder({
            where: { id: Number(id) },
            data: { status: status },
        });
    }

    @SetMetadata('roles', ['ADMIN'])
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Get('order/:id')
    async getOrderById(@Param('id') id: string): Promise<OrderModel> {
        return await this.orderService.order({ id: Number(id) });
    }

    @SetMetadata('roles', ['ADMIN'])
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Get('order')
    async getOrders(
        @Query('status') status?: $Enums.OrderStatus,
        @Query('type') type?: $Enums.OrderType,
    ): Promise<OrderModel[]> {
        if (status && type) {
            return await this.orderService.orders({
                where: { status, type },
            });
        }
        if (!status && !type) {
            return await this.orderService.orders({});
        }
        if (!status && type) {
            return await this.orderService.orders({
                where: { type },
            });
        }
        if (status && !type) {
            return await this.orderService.orders({
                where: { status },
            });
        }
    }

    @SetMetadata('roles', ['ADMIN'])
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Delete('order/:id')
    async deleteOrder(@Param('id') id: string): Promise<OrderModel> {
        return await this.orderService.deleteOrder({ id: Number(id) });
    }
}
