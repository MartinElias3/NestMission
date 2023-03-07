import { Activity } from 'src/activities/activity.schema';
import { User } from 'src/users/users.schema';

export interface IBooking {
  user: User;
  activity: Activity;
  startedAt: string;
  finishedAt: string;
  status: string;
}
