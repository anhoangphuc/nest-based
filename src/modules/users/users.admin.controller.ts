import { Controller, DefaultValuePipe, Get, ParseArrayPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../shares/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { plainToInstance } from 'class-transformer';
import { UsersInfoResponseDto } from './dto/users-info-response.dto';
import { Roles } from '../../shares/decorators/roles.decorator';
import { UsersRole } from '../../shares/enums/users-role.enum';
import { RolesGuard } from '../../shares/guards/roles.guard';
import { ParseArrayEnumPipe } from '../../shares/pipes/array-enum.pipe';

@Controller('admin/users')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UsersRole.ADMIN)
@UseGuards(JwtAuthGuard)
export class UsersAdminController {
  constructor(private readonly usersService: UsersService) {}
  @Get('')
  @ApiOperation({
    operationId: 'admin-get-list-user',
    description: 'Admin get list of users',
    summary: 'Admin get list of users',
  })
  @ApiQuery({
    name: 'role',
    description: 'List of role want to query',
    example: 'USER_ACTIVATE,USER_INACTIVATED',
    required: false,
  })
  @ApiQuery({
    name: 'email',
    description: 'List of email want to query',
    example: 'john@email.com,witch@email.com',
    required: false,
  })
  @ApiResponse({
    type: UsersInfoResponseDto,
    status: 200,
    description: 'Successful',
    isArray: true,
  })
  async getListUsers(
    @Query('role', new DefaultValuePipe([]), ParseArrayPipe, new ParseArrayEnumPipe(UsersRole)) role: UsersRole[],
    @Query('email', new DefaultValuePipe([]), ParseArrayPipe) email: string[],
  ) {
    const res = await this.usersService.getListOfUsers({ email, role }, null);
    return plainToInstance(UsersInfoResponseDto, res);
  }
}
