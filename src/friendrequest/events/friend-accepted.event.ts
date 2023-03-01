import { User } from 'src/users/users.schema';

export class FriendAcceptedEvent {
  sender: User;
  receiver: User;
}
