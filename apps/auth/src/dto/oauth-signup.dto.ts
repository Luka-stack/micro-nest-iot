import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class OAuthSignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}
