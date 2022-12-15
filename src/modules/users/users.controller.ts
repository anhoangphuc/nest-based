import { Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateNewUserRequestDto } from './dto/create-new-user.request.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  async getListUsers() {
    return await this.usersService.getListOfUsers(null);
  }
}
