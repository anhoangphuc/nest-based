import { Body, Controller, Get, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthService } from './auth.service';
import { plainToInstance } from 'class-transformer';
import { LocalAuthGuard } from '../../shares/guards/local-auth.guard';
import { JwtAuthGuard } from '../../shares/guards/jwt-auth.guard';
import { RegisterRequestDto } from './dto/register-request.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { RegisterResponseDto } from './dto/register-response.dto';
import { VerifyResponseDto } from './dto/verify-response.dto';
import { UpdatePasswordRequestDto } from './dto/update-password-request.dto';
import { UpdatePasswordResponseDto } from './dto/update-password-response.dto';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    operationId: 'user-register',
    description: 'User register an account',
    summary: 'User register an account',
  })
  @ApiBody({
    type: RegisterRequestDto,
  })
  @ApiResponse({
    type: RegisterResponseDto,
    status: HttpStatus.CREATED,
    description: 'Successful',
  })
  async register(@Body() registerRequest: RegisterRequestDto): Promise<RegisterResponseDto> {
    const res = await this.authService.register(registerRequest);
    return plainToInstance(RegisterResponseDto, res);
  }

  @Get('verify-token/:token')
  @ApiOperation({
    operationId: 'user-verify',
    description: 'User verify token to activate account',
    summary: 'User verify token to activate account',
  })
  @ApiParam({
    name: 'token',
    description: 'Token used for verifying',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhvYW5',
  })
  async verifyToken(@Request() request, @Param('token') token: string): Promise<VerifyResponseDto> {
    const res = await this.authService.verifyToken(token);
    return plainToInstance(VerifyResponseDto, res);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    operationId: 'user-login',
    description: 'User login with email and password, received login token',
    summary: 'User login with email and password, received login token',
  })
  @ApiBody({
    type: LoginRequestDto,
  })
  @ApiResponse({
    type: LoginResponseDto,
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async login(@Request() request, @Body() loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    const { user } = request;
    const res = await this.authService.login(user);
    return plainToInstance(LoginResponseDto, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-password')
  @ApiOperation({
    operationId: 'user-update-password',
    description: 'User update password',
    summary: 'User update password',
  })
  @ApiBody({
    type: UpdatePasswordRequestDto,
  })
  @ApiResponse({
    type: UpdatePasswordResponseDto,
  })
  async updatePassword(
    @Request() request,
    @Body() updatePasswordRequest: UpdatePasswordRequestDto,
  ): Promise<UpdatePasswordResponseDto> {
    const { user } = request;
    const res = await this.authService.updatePassword(user, updatePasswordRequest);
    return plainToInstance(UpdatePasswordResponseDto, res);
  }
}
