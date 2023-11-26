import { IsNotEmpty, IsNumber } from 'class-validator';

export class FindAllCompaniesDto {
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsNumber()
  @IsNotEmpty()
  pageSize: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
