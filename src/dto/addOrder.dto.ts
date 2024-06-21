import { $Enums } from '@prisma/client';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AddOrderDto {
    @IsInt()
    @IsNotEmpty()
    carId: number;

    @IsInt()
    @IsNotEmpty()
    userId: number;

    @IsString()
    @IsNotEmpty()
    status: $Enums.OrderStatus;

    @IsString()
    @IsNotEmpty()
    type: $Enums.OrderType;
}
