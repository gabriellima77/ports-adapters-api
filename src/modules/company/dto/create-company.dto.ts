import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
