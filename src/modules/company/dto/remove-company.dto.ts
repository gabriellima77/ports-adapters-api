import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveCompanyDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
