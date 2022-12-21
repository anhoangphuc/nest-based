import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@Expose()
export class UpdatePasswordRequestDto {
  @ApiProperty({
    type: String,
    description: 'New password',
    example: '2',
  })
  @IsString()
  newPassword: string;
}
