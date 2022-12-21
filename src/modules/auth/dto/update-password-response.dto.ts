import { PublicUserInfoResponseDto } from '../../users/dto/public-user-info.response.dto';
import { Exclude } from 'class-transformer';

@Exclude()
export class UpdatePasswordResponseDto extends PublicUserInfoResponseDto {}
