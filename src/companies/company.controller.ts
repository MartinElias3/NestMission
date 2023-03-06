import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { response } from 'express';
import { IdDto } from './dto/idDto';
import { CreateCompanyDto } from './dto/createCompanyDto';
import { UpdateCompanyDto } from './dto/updateCompanyDto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @Get()
  async findAll() {
    try {
      const companies = await this.companyService.findAll();
      return companies;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'COMPANIES_NOT_FOUND',
            error: 'Companies not found',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      }
      return response.status(HttpStatus.BAD_REQUEST).json({
        code: 'BAD_REQUEST',
        message: 'We could not retrieve the companies',
      });
    }
  }
  @Get(':id')
  async find(@Param(new ValidationPipe({ whitelist: true })) { id }: IdDto) {
    try {
      const company = await this.companyService.findOne(id);
      return company;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'COMPANY_NOT_FOUND',
            error: 'Company not found',
            message: 'We could not found the company with id ${id}',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      }
      return response.status(HttpStatus.BAD_REQUEST).json({
        code: 'BAD_REQUEST',
        message: 'We could not retrieve the company',
      });
    }
  }

  @Post()
  async create(
    @Res() response: any,
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    try {
      const company = await this.companyService.create(createCompanyDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Compant has been successfully created',
        company,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'We could not create the company',
      });
    }
  }
  @Put(':id')
  async update(
    @Res() response: any,
    @Param(new ValidationPipe({ whitelist: true })) { id }: IdDto,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    try {
      const company = await this.companyService.update(id, updateCompanyDto);
      return response.status(HttpStatus.OK).json({
        message: 'Company has been updated',
        company,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'USER_RECEIVER_NOT_FOUND',
            error: 'User receiver not found',
            message: 'We could not found the user receiver with id ${id}',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      } else if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'COMPANY_NOT_FOUND',
            error: 'Company not found',
            message: 'We could not found the company with id ${id}',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      }
    }
  }

  @Delete(':id')
  async remove(
    @Res() response: any,
    @Param(new ValidationPipe({ whitelist: true })) { id }: IdDto,
  ) {
    try {
      await this.companyService.delete(id);
      return response.status(HttpStatus.OK).json({
        status: HttpStatus.ACCEPTED,
        message: 'Company has been succesfully deleted',
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'COMPANY_NOT_FOUND',
            error: 'Company not found',
            message: 'We could not found the company',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      } else {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'We could not retrieve the company',
        });
      }
    }
  }
  @Put('disable/:id')
  async disable(
    @Res() response: any,
    @Param(new ValidationPipe({ whitelist: true })) { id }: IdDto,
  ) {
    try {
      await this.companyService.disable(id);
      return response.status(HttpStatus.OK).json({
        message: 'Company has been successfully disabled',
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'COMPANY_NOT_FOUND',
            error: 'Company not found',
            message: 'We could not found the company with id ${id}',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      } else {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'We could not disable the company',
        });
      }
    }
  }
}
