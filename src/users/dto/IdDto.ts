import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ObjectId } from 'mongodb';

export class IdDto {
  @IsMongoId()
  id: string;
}
