import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from './user.interface';
import { CreateUserDto } from './dto/createUserDto';
import { UpdateUserDto } from './dto/updateUserDto';
import { User, UserDocument } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<IUser[]> {
    const users = await this.userModel.find().exec();
    if (users === null) {
      throw new NotFoundException('users not found');
    }
    return users;
  }

  async findOne(id: string): Promise<IUser | null> {
    const user = await this.userModel.findById(id).exec();
    if (user === null) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const createdUser = await this.userModel.create(createUserDto);
    return createdUser;
  }
  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUser | null> {
    const userUpdated = await this.userModel.findByIdAndUpdate(
      userId,
      updateUserDto,
      {
        new: true,
      },
    );
    if (userUpdated == null) {
      throw new NotFoundException('user not found');
    }
    return userUpdated;
  }

  async delete(id: string): Promise<any> {
    const userToDelete = await this.userModel.findById(id).exec();
    if (userToDelete == null) {
      throw new NotFoundException('user not found');
    }
    return await this.userModel.deleteOne({ _id: id });
  }

  async disable(id: string): Promise<IUser | null> {
    const user = await this.userModel.findById(id).exec();
    if (user === null) {
      throw new NotFoundException('user not found');
    }

    user.isDisable = true;
    await user.save();

    return user;
  }
}
