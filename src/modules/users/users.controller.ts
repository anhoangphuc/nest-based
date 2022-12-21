import { Controller, Get, UseGuards, Request, HttpStatus, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../shares/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersInfoResponseDto } from './dto/users-info-response.dto';
import { UserNotFoundException } from '../../shares/exceptions/users.exception';
import { plainToInstance } from 'class-transformer';
import { LinkAddressRequestDto } from './dto/link-address-request.dto';
import { RolesGuard } from '../../shares/guards/roles.guard';
import { Roles } from '../../shares/decorators/roles.decorator';
import { UsersRole } from '../../shares/enums/users-role.enum';

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

  @Post('link-address')
  @UseGuards(RolesGuard)
  @Roles(UsersRole.USER_ACTIVATED)
  @ApiOperation({
    operationId: 'user-link-eth-address',
    description: 'User link eth address',
    summary: 'User link eth address',
  })
  @ApiBody({
    type: LinkAddressRequestDto,
  })
  async linkAddress(@Request() request, @Body() linkAddressRequest: LinkAddressRequestDto) {
    const { user } = request;
    const updatedUser = await this.usersService.linkAddress(user.email, linkAddressRequest, null);
    return plainToInstance(UsersInfoResponseDto, updatedUser);
  }
}
