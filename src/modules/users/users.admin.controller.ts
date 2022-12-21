import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../shares/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { plainToInstance } from 'class-transformer';
import { UsersInfoResponseDto } from './dto/users-info-response.dto';

@Controller('admin/users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UsersAdminController {
  constructor(private readonly usersService: UsersService) {}
  @Get('')
  @ApiOperation({
    operationId: 'admin-get-list-user',
    description: 'Admin get list of users',
    summary: 'Admin get list of users',
  })
  @ApiResponse({
    type: UsersInfoResponseDto,
    isArray: true,
  })
  async getListUsers() {
    const res = await this.usersService.getListOfUsers({}, null);
    return plainToInstance(UsersInfoResponseDto, res);
  }
}
