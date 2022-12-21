import { Controller, Get, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../shares/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersInfoResponseDto } from './dto/users-info-response.dto';
import { UserNotFoundException } from '../../shares/exceptions/users.exception';
import { plainToInstance } from 'class-transformer';

@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  @ApiOperation({
    operationId: 'user-get-info',
    description: 'User get his information',
    summary: 'User get his information',
  })
  @ApiResponse({
    type: UsersInfoResponseDto,
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async getUserInfo(@Request() request): Promise<UsersInfoResponseDto> {
    const { user } = request;
    const foundUser = await this.usersService.getListOfUsers({ email: [user.email] }, null);
    if (foundUser.length === 0) throw new UserNotFoundException({ email: user.email });
    return plainToInstance(UsersInfoResponseDto, foundUser[0]);
  }
}
