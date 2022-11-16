import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthService } from './auth.service';
import { plainToInstance } from 'class-transformer';
import { LocalAuthGuard } from '../../shares/guards/local-auth.guard';
import { JwtAuthGuard } from '../../shares/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
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
