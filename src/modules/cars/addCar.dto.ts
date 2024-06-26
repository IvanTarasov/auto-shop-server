import { $Enums } from '@prisma/client';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

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
    status: $Enums.CarStatus;

    @IsString()
    @IsNotEmpty()
    type: $Enums.CarType;
}
