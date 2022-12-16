import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RegisterRequestDto {
  @Expose()
  email: string;

  @Expose()
  password: string;
}
