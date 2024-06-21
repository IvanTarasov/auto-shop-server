import { $Enums } from '@prisma/client';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddCarDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @IsNotEmpty()
    price: number;

    @IsInt()
    @IsNotEmpty()
    year: number;

    @IsString()
    description: string;

    @IsString()
    @IsNotEmpty()
    status: $Enums.CarStatus;

    @IsString()
    @IsNotEmpty()
    type: $Enums.CarType;
}
