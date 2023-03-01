import { IsNotEmpty } from 'class-validator';
import { User } from 'src/users/users.schema';

export class CreateFriendRequestDto {
  @IsNotEmpty()
  sender: User;
  @IsNotEmpty()
  receiver: User;
  @IsNotEmpty()
  hasBeenSeen: boolean;
  @IsNotEmpty()
  hasBeenAccepted: boolean;
}
