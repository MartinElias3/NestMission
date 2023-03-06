import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity, ActivityDocument } from './activity.schema';
import { Company, CompanyDocument } from 'src/companies/company.schema';
import { IActivity } from './activity.interface';
import { CreateActivityDto } from './dto/createActivityDto';
import { UpdateActivityDto } from './dto/updateActivityDto';
import { IdDto } from './dto/idDto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name)
    private readonly activityModel: Model<ActivityDocument>,
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async findAll(): Promise<IActivity[]> {
    const activities = await this.activityModel.find().exec();
    if (activities === null) {
      throw new NotFoundException('activities not found');
    }
    return activities;
  }

  async findOne(id: string): Promise<IActivity | null> {
    const activity = await this.activityModel.findById(id).exec();
    if (activity === null) {
      throw new NotFoundException('activity not found');
    }
    return activity;
  }
  async create(createActivityDto: CreateActivityDto): Promise<IActivity> {
    const activity = await this.activityModel.create(createActivityDto);
    return activity;
  }
  async update(
    activityId: string,
    uodateActivityDto: UpdateActivityDto,
  ): Promise<IActivity | null> {
    const activityUpdated = await this.activityModel.findByIdAndUpdate(
      activityId,
      uodateActivityDto,
      {
        new: true,
      },
    );
    if (activityUpdated == null) {
      throw new NotFoundException('activity not found');
    }
    return activityUpdated;
  }

  async delete(id: string): Promise<any> {
    const activityToDelete = await this.activityModel.findById(id).exec();
    if (activityToDelete == null) {
      throw new NotFoundException('activity not found');
    }
    return await this.activityModel.deleteOne({ _id: id });
  }
  async disable(id: string): Promise<IActivity> {
    const activity = await this.activityModel.findById(id).exec();
    if (activity === null) {
      throw new NotFoundException('activity not found');
    }
    activity.isDisable = true;
    await activity.save();

    return activity;
  }

  async findAllActivitiesByCompanies(companyId: string): Promise<IActivity[]> {
    const company = this.companyModel.findById(companyId);
    if (company === null) {
      throw new NotFoundException('company not found');
    }
    const activities = await this.activityModel
      .find({
        company: companyId,
        isDisable: false,
      })
      .exec();
    if (activities === null) {
      throw new NotFoundException('activities not found');
    }
    return activities;
  }

}
