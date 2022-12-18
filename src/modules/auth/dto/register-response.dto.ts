import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class RegisterResponseDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Verify token to verify account',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhvYW5',
  })
  verifyToken: string;
}
