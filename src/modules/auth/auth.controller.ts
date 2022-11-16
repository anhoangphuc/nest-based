import { Body, Controller, Post, Request } from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthService } from './auth.service';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Request() request, @Body() loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    const { user } = request;
    const res = await this.authService.login(user);
    return plainToInstance(LoginResponseDto, res);
  }
}
