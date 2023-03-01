import { IsMongoId, IsNotEmpty } from 'class-validator';
import { User } from 'src/users/users.schema';

export class HandleFriendRequestDto {
  @IsMongoId()
  id: string;
  @IsNotEmpty()
  hasBeenAccepted: boolean;
}
