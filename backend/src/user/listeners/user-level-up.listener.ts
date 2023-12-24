import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserLevelUpEvent } from '../events/user-level-up.event';

@Injectable()
export class UserLevelUpListener {
  constructor() {}

  @OnEvent('user.levelup')
  async handleUserLevelUp(event: UserLevelUpEvent) {}
}
