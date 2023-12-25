import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { DatabaseService } from 'src/database/database.service';

import { BASE_EXP, shouldLevelUp } from 'src/utils/levels';
import { Events } from 'src/events';

@Injectable()
export class UserAnsweredCorrectlyListener {
  constructor(
    private db: DatabaseService,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(Events.INTERNAL.userAnsweredCorrectly)
  async handleUserAnsweredCorrectlyEvent(
    event: InstanceType<
      typeof Events.PAYLOADS.UserAnsweredCorrectlyEventPayload
    >,
  ) {
    const { user } = event;

    const { id, levelPoints: levelPoints, level } = user;

    const newLevelPoints = levelPoints + BASE_EXP;

    if (!shouldLevelUp(level, levelPoints + newLevelPoints)) {
      const updatedUser = await this.db.user.update({
        where: { id: id },
        data: { levelPoints: newLevelPoints },
      });

      this.eventEmitter.emit(
        Events.APP.userChangeInXP,
        new Events.PAYLOADS.UserAnsweredCorrectlyEventPayload(updatedUser),
      );

      return;
    }

    const updatedUser = await this.db.user.update({
      where: { id: id },
      data: { level: level + 1, levelPoints: 0 },
    });

    this.eventEmitter.emit(
      Events.APP.userLevelUp,
      new Events.PAYLOADS.UserLevelUpEventPayload(updatedUser),
    );
  }
}
