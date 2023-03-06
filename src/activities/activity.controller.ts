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
import { response } from 'express';
import { IdDto } from './dto/idDto';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/createActivityDto';
import { UpdateActivityDto } from './dto/updateActivityDto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
  @Get()
  async findAll() {
    try {
      const activities = await this.activityService.findAll();
      return activities;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'ACTIVITIES_NOT_FOUND',
            error: 'Activities not found',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      }
      return response.status(HttpStatus.BAD_REQUEST).json({
        code: 'BAD_REQUEST',
        message: 'We could not retrieve the activities',
      });
    }
  }
  @Get(':id')
  async find(@Param(new ValidationPipe({ whitelist: true })) { id }: IdDto) {
    try {
      const activity = await this.activityService.findOne(id);
      return activity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'ACTIVITY_NOT_FOUND',
            error: 'Activity not found',
            message: 'We could not found the activity with id ${id}',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      }
      return response.status(HttpStatus.BAD_REQUEST).json({
        code: 'BAD_REQUEST',
        message: 'We could not retrieve the activity',
      });
    }
  }

  @Post()
  async create(
    @Res() response: any,
    @Body() createActivityDto: CreateActivityDto,
  ) {
    try {
      const activity = await this.activityService.create(createActivityDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Activity has been successfully created',
        activity,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'We could not create the activity',
      });
    }
  }
  @Put(':id')
  async update(
    @Res() response: any,
    @Param(new ValidationPipe({ whitelist: true })) { id }: IdDto,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    try {
      const activity = await this.activityService.update(id, updateActivityDto);
      return response.status(HttpStatus.OK).json({
        message: 'Activity has been updated',
        activity,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'ACTIVITY_NOT_FOUND',
            error: 'Activity not found',
            message: 'We could not found the activity with id ${id}',
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
      await this.activityService.delete(id);
      return response.status(HttpStatus.OK).json({
        status: HttpStatus.ACCEPTED,
        message: 'Activity has been succesfully deleted',
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'ACTIVITY_NOT_FOUND',
            error: 'Activity not found',
            message: 'We could not found the activity',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      } else {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'We could not delete the activity',
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
      await this.activityService.disable(id);
      return response.status(HttpStatus.OK).json({
        message: 'Activity has been successfully disabled',
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'ACTIVITY_NOT_FOUND',
            error: 'Activity not found',
            message: 'We could not found the activity with id ${id}',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      } else {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'We could not disable the activity',
        });
      }
    }
  }

  @Get('company/:id')
  async findAllByCompanies(
    @Param(new ValidationPipe({ whitelist: true })) { id }: IdDto,
  ) {
    try {
      const activities =
        await this.activityService.findAllActivitiesByCompanies(id);
      return activities;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'ACTIVITIES_NOT_FOUND',
            error: 'Activities not found',
            message: 'We could not found the activities or the company',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      }
      return response.status(HttpStatus.BAD_REQUEST).json({
        code: 'BAD_REQUEST',
        message: 'We could not retrieve the activities',
      });
    }
  }

}
