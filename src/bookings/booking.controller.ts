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
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/createBookingDto';
import { UpdateBookingDto } from './dto/updateBookingDto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @Get()
  async findAll() {
    try {
      const bookings = await this.bookingService.findAll();
      return bookings;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'BOOKINGS_NOT_FOUND',
            error: 'Bookings not found',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      }
      return response.status(HttpStatus.BAD_REQUEST).json({
        code: 'BAD_REQUEST',
        message: 'We could not retrieve the bookings',
      });
    }
  }
  @Get(':id')
  async find(@Param(new ValidationPipe({ whitelist: true })) { id }: IdDto) {
    try {
      const booking = await this.bookingService.findOne(id);
      return booking;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'BOOKING_NOT_FOUND',
            error: 'Booking not found',
            message: 'We could not found the booking with id ${id}',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      }
      return response.status(HttpStatus.BAD_REQUEST).json({
        code: 'BAD_REQUEST',
        message: 'We could not retrieve the booking',
      });
    }
  }

  @Post()
  async create(
    @Res() response: any,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    try {
      const booking = await this.bookingService.create(createBookingDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Booking has been successfully created',
        booking,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'We could not create the booking',
      });
    }
  }
  @Put(':id')
  async update(
    @Res() response: any,
    @Param(new ValidationPipe({ whitelist: true })) { id }: IdDto,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    try {
      const booking = await this.bookingService.update(id, updateBookingDto);
      return response.status(HttpStatus.OK).json({
        message: 'Booking has been updated',
        booking,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'BOOKING_NOT_FOUND',
            error: 'Booking not found',
            message: 'We could not found the booking with id ${id}',
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
      await this.bookingService.delete(id);
      return response.status(HttpStatus.OK).json({
        status: HttpStatus.ACCEPTED,
        message: 'Booking has been succesfully deleted',
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'BOOKING_NOT_FOUND',
            error: 'Booking not found',
            message: 'We could not found the booking',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      } else {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'We could not delete the booking',
        });
      }
    }
  }
}
