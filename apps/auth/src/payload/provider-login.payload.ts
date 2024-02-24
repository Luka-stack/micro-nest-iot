import { IsEmail, IsString } from 'class-validator';

export class ProviderLoginPayload {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  idToken: string;

  @IsString()
  appKey: string;
}
