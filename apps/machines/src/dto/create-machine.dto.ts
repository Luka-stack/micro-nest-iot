import { IsNumber, IsString } from 'class-validator';

export class CreateMachineDto {
  @IsString()
  serialNumber: string;

  @IsString()
  producent: string;

  @IsString()
  type: string;

  @IsNumber(
    {},
    { message: 'modelId must be a number that represents model identificator' },
  )
  modelId: number;
}
