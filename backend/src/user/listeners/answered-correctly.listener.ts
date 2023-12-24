import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { DatabaseService } from 'src/database/database.service';
import { UserAnsweredCorrectlyEvent } from '../events/asnwered-correctly.event';
import { BASE_EXP, shouldLevelUp } from 'src/utils/levels';

@Injectable()
export class UserAnsweredCorrectlyListener {
  constructor(
    private db: DatabaseService,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('user.answer.correct')
  async handleUserAnsweredCorrectlyEvent(event: UserAnsweredCorrectlyEvent) {
    const {
      user: { id, level_points: levelPoints, level },
    } = event;

    const newLevelPoints = levelPoints + BASE_EXP * 1000;

    if (!shouldLevelUp(level, levelPoints + newLevelPoints)) {
      await this.db.user.update({
        where: { id: id },
        data: { level_points: newLevelPoints },
      });

      return;
    }

    await this.db.user.update({
      where: { id: id },
      data: { level: level + 1, level_points: 0 },
    });

    this.eventEmitter.emit('user.levelup');
  }
}
