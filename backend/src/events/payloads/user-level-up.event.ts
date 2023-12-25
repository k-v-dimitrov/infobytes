import { User } from '@prisma/client';

export class UserLevelUpEventPayload {
  public user: User;

  constructor(user: User) {
    this.user = user;
  }
}
