import { User } from '@prisma/client';

export class UserAnsweredCorrectlyEvent {
  public user: User;

  constructor(user: User) {
    this.user = user;
  }
}
