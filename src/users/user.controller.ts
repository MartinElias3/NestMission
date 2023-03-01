import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
  HttpStatus,
  NotFoundException,
  HttpException,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UsersService } from './user.service';
import { response } from 'express';
import { UpdateUserDto } from './dto/updateUserDto';
import { IdDto } from './dto/IdDto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  async findAll() {
    try {
      const users = await this.userService.findAll();
      return users;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'USERS_NOT_FOUND',
            error: 'Users not found',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      }
      return response.status(HttpStatus.BAD_REQUEST).json({
        code: 'BAD_REQUEST',
        message: 'We could not retrieve the users',
      });
    }
  }
  @Get(':id')
  async find(@Param(new ValidationPipe({ whitelist: true })) { id }: IdDto) {
    try {
      const user = await this.userService.findOne(id);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'USER_NOT_FOUND',
            error: 'User not found',
            message: 'We could not found the user with id ${id}',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      }
      return response.status(HttpStatus.BAD_REQUEST).json({
        code: 'BAD_REQUEST',
        message: 'We could not retrieve the user',
      });
    }
  }

  @Post()
  async create(@Res() response: any, @Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'User has been successfully created',
        user,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'We could not create the user',
      });
    }
  }

  @Put(':id')
  async edit(
    @Res() response: any,
    @Param(new ValidationPipe({ whitelist: true })) { id }: IdDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const userUpdated = await this.userService.update(id, updateUserDto);
      return response.status(HttpStatus.OK).json({
        message: 'User with id ${id} has been successfully updated',
        userUpdated,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'USER_NOT_FOUND',
            error: 'User not found',
            message: 'We could not found the user with id ${id}',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      } else {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'We could not update the user',
        });
      }
    }
  }

  @Delete(':id')
  async remove(
    @Res() response: any,
    @Param(new ValidationPipe({ whitelist: true })) { id }: IdDto,
  ) {
    try {
      await this.userService.delete(id);
      return response.status(HttpStatus.OK).json({
        status: HttpStatus.ACCEPTED,
        message: 'User with id ${id} has been succesfully deleted',
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'USER_NOT_FOUND',
            error: 'User not found',
            message: 'We could not found the user with id ${id}',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      } else {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'We could not retrieve the user with id ${id}',
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
      await this.userService.disable(id);
      return response.status(HttpStatus.OK).json({
        message: 'User with id ${id} has been successfully disabled',
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'USER_NOT_FOUND',
            error: 'User not found',
            message: 'We could not found the user with id ${id}',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      } else {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'We could not disable the user',
        });
      }
    }
  }
}
