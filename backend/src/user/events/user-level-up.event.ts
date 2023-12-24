import { User } from '@prisma/client';

export class UserLevelUpEvent {
  public user: User;

  constructor(user: User) {
    this.user = user;
  }
}
