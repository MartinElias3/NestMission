import { IsMongoId } from 'class-validator';

export class addfriendDto {
  @IsMongoId()
  idSender: string;
  @IsMongoId()
  idReceiver: string;
}
