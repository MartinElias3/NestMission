import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Booking, BookingDocument } from './booking.schema';
import { Model } from 'mongoose';
import { IBooking } from './booking.interface';
import { CreateBookingDto } from './dto/createBookingDto';
import { UpdateBookingDto } from './dto/updateBookingDto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
  ) {}

  async findAll(): Promise<IBooking[]> {
    const bookings = await this.bookingModel.find().exec();

    if (bookings === null) {
      throw new NotFoundException('activities not found');
    }
    return bookings;
  }

  async findOne(id: string): Promise<IBooking | null> {
    const booking = await this.bookingModel.findById(id).exec();
    if (booking === null) {
      throw new NotFoundException('booking not found');
    }
    return booking;
  }
  async create(createBookingDto: CreateBookingDto): Promise<IBooking> {
    const booking = await this.bookingModel.create(createBookingDto);
    return booking;
  }
  async update(
    bookingId: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<IBooking | null> {
    const bookingUpdated = await this.bookingModel.findByIdAndUpdate(
      bookingId,
      updateBookingDto,
      {
        new: true,
      },
    );
    if (bookingUpdated == null) {
      throw new NotFoundException('booking not found');
    }
    return bookingUpdated;
  }

  async delete(id: string): Promise<any> {
    const bookingToDelete = await this.bookingModel.findById(id).exec();
    if (bookingToDelete == null) {
      throw new NotFoundException('booking not found');
    }
    return await this.bookingModel.deleteOne({ _id: id });
  }
}
