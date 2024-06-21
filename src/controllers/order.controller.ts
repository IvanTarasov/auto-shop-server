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
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { $Enums, Order as OrderModel, Prisma } from '@prisma/client';
import { AddOrderDto } from '../dto/addOrder.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller()
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Roles($Enums.Role.ADMIN)
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @Post('order')
    async addOrder(@Body() orderData: AddOrderDto): Promise<OrderModel> {
        return await this.orderService.addOrder({
            user: { connect: { id: orderData.userId } },
            car: { connect: { id: orderData.carId } },
            status: orderData.status,
            type: orderData.type,
        });
    }

    @Roles($Enums.Role.ADMIN, $Enums.Role.USER)
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
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

    @Roles($Enums.Role.ADMIN)
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @Get('order/:id')
    async getOrderById(@Param('id') id: string): Promise<OrderModel> {
        return await this.orderService.order({ id: Number(id) });
    }

    @Roles($Enums.Role.ADMIN)
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
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

    @Roles($Enums.Role.ADMIN)
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @Delete('order/:id')
    async deleteOrder(@Param('id') id: string): Promise<OrderModel> {
        return await this.orderService.deleteOrder({ id: Number(id) });
    }
}
