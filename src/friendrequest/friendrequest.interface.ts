import { User } from 'src/users/users.schema';
export interface IFriendRequest {
  sender: User;
  receiver: User;
  hasBeenSeen: boolean;
  hasBeenAccepted: boolean;
}
