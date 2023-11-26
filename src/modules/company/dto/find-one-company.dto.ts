import { IsNotEmpty, IsNumber } from 'class-validator';

export class FindOneCompanyDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
