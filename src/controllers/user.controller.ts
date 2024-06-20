import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete,
  } from '@nestjs/common';
  import { UserService } from '../services/user.service';
  import { User as UserModel} from '@prisma/client';
  
  @Controller()
  export class UserController {
    constructor(
      private readonly userService: UserService,
    ) {}
  
    @Post('user')
    async registration(
      @Body() userData: { email: string; name: string; password: string; phone: string},
    ): Promise<UserModel> {
      return this.userService.createUser(userData);
    }
  }