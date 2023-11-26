import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';

export class CompanyDataToUpdate extends PartialType(CreateCompanyDto) {}

export class UpdateCompanyDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsObject()
  @IsNotEmpty()
  dataToUpdate: CompanyDataToUpdate;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
