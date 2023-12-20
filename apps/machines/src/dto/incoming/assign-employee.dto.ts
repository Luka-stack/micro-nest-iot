import { IsEmail, IsOptional } from 'class-validator';

export class AssignEmployeeDto {
  @IsEmail()
  @IsOptional()
  employee?: string;
}
