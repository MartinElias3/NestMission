import { IsNotEmpty } from 'class-validator';
import { Activity } from 'src/activities/activity.schema';
import { User } from 'src/users/users.schema';

export class CreateBookingDto {
  @IsNotEmpty()
  user: User;
  @IsNotEmpty()
  activity: Activity;
  @IsNotEmpty()
  startedAt: string;
  @IsNotEmpty()
  finishedAt: string;
  @IsNotEmpty()
  status: string;
}
