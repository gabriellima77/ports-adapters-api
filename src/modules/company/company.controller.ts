import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyDataToUpdate } from './dto/update-company.dto';
import { AuthGuard } from '../auth/auth.guard';
import { PayloadDto } from '../user/dto/payload.dto';

@Controller('companies')
@UseGuards(AuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(
    @Body() createCompanyDto: Omit<CreateCompanyDto, 'userId'>,
    @Request() request: { user: PayloadDto },
  ) {
    const {
      user: { sub },
    } = request;

    return this.companyService.create({
      ...createCompanyDto,
      userId: +sub,
    });
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Request() request: { user: PayloadDto },
  ) {
    const {
      user: { sub },
    } = request;
    return this.companyService.findAll({
      page,
      pageSize,
      userId: +sub,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() request: { user: PayloadDto }) {
    const {
      user: { sub },
    } = request;
    return this.companyService.findOne({
      id: +id,
      userId: +sub,
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dataToUpdate: CompanyDataToUpdate,
    @Request() request: { user: PayloadDto },
  ) {
    const {
      user: { sub },
    } = request;

    return this.companyService.update({
      id: +id,
      dataToUpdate,
      userId: +sub,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() request: { user: PayloadDto }) {
    const {
      user: { sub },
    } = request;
    return this.companyService.remove({
      id: +id,
      userId: +sub,
    });
  }
}
