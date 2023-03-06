import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Company, CompanyDocument } from './company.schema';
import { ICompany } from './company.interface';
import { CreateCompanyDto } from './dto/createCompanyDto';
import { CompanyAlreadyExistsException } from './exceptions/company.alreadyexists.exception';

import { IdDto } from './dto/idDto';
import { UpdateCompanyDto } from './dto/updateCompanyDto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async findAll(): Promise<ICompany[]> {

    const companies = await this.companyModel
      .find({
        isDisable: false,
      })
      .exec();

    const companies = await this.companyModel.find().exec();

    if (companies === null) {
      throw new NotFoundException('companies not found');
    }
    return companies;
  }

  async findOne(id: string): Promise<ICompany | null> {
    const company = await this.companyModel.findById(id).exec();
    if (company === null) {
      throw new NotFoundException('company not found');
    }
    return company;
  }
  async create(createCompanyDto: CreateCompanyDto): Promise<ICompany> {
    if (
      (await this.companyModel
        .findOne({ name: createCompanyDto.name })
        .exec()) != null
    ) {
      throw new CompanyAlreadyExistsException();
    }
    const company = await this.companyModel.create(createCompanyDto);
    return company;
  }
  async disable(id: string): Promise<ICompany> {
    const company = await this.companyModel.findById(id).exec();
    if (company === null) {
      throw new NotFoundException('company not found');
    }
    company.isDisable = true;
    await company.save();

    return company;
  }

  async update(
    companyId: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<ICompany | null> {
    const companyUpdated = await this.companyModel.findByIdAndUpdate(
      companyId,
      updateCompanyDto,
      {
        new: true,
      },
    );
    if (companyUpdated == null) {
      throw new NotFoundException('Company not found');
    }
    return companyUpdated;
  }

  async delete(id: string): Promise<any> {
    const companyToDelete = await this.companyModel.findById(id).exec();
    if (companyToDelete == null) {
      throw new NotFoundException('company not found');
    }
    return await this.companyModel.deleteOne({ _id: id });
  }
}
