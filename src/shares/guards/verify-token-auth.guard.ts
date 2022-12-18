import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerifyTokenAuthGuard extends AuthGuard('verify-token') {}
