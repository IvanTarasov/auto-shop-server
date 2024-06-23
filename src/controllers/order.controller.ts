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
import { OrderService } from '../services/order.service';
import { $Enums, Order as OrderModel, Prisma } from '@prisma/client';
import { AddOrderDto } from '../dto/addOrder.dto';
import { AuthGuard } from '../modules/auth/auth.guard';
import { RolesGuard } from '../modules/auth/roles.guard';

@Controller()
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post('order')
    async addOrder(@Body() orderData: AddOrderDto): Promise<OrderModel> {
        return await this.orderService.addOrder({
            user: { connect: { id: orderData.userId } },
            car: { connect: { id: orderData.carId } },
            status: orderData.status,
            type: orderData.type,
        });
    }

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

    @Get('order/:id')
    async getOrderById(@Param('id') id: string): Promise<OrderModel> {
        return await this.orderService.order({ id: Number(id) });
    }

    @SetMetadata('roles', ['ADMIN'])
    @UseGuards(AuthGuard)
    //@UseGuards(RolesGuard)
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

    @Delete('order/:id')
    async deleteOrder(@Param('id') id: string): Promise<OrderModel> {
        return await this.orderService.deleteOrder({ id: Number(id) });
    }
}
