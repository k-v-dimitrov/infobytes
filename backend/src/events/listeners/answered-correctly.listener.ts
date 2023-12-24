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
    console.log('here');

    const { user } = event;

    const { id, level_points: levelPoints, level } = user;

    const newLevelPoints = levelPoints + BASE_EXP * 1000;

    if (!shouldLevelUp(level, levelPoints + newLevelPoints)) {
      await this.db.user.update({
        where: { id: id },
        data: { level_points: newLevelPoints },
      });

      return;
    }

    console.log('here 2');

    const updatedUser = await this.db.user.update({
      where: { id: id },
      data: { level: level + 1, level_points: 0 },
    });

    this.eventEmitter.emit(
      Events.APP.userLevelUp,
      new Events.PAYLOADS.UserLevelUpEventPayload(updatedUser),
    );
  }
}
