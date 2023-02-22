import { IsString } from 'class-validator';

export class CreateMachineDto {
  @IsString()
  serialNumber: string;

  @IsString()
  producent: string;

  @IsString()
  type: string;

  @IsString()
  model: string;
}
