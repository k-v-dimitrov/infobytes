import { User } from '@prisma/client';

export class UserAnsweredCorrectlyEventPayload {
  public user: User;

  constructor(user: User) {
    this.user = user;
  }
}
