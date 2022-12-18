import { Body, Controller, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthService } from './auth.service';
import { plainToInstance } from 'class-transformer';
import { LocalAuthGuard } from '../../shares/guards/local-auth.guard';
import { JwtAuthGuard } from '../../shares/guards/jwt-auth.guard';
import { RegisterRequestDto } from './dto/register-request.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterResponseDto } from './dto/register-response.dto';

@Controller('auth')
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
  async updatePassword(@Request() request) {
    const { user } = request;
    return await this.authService.updatePassword(user);
  }
}
