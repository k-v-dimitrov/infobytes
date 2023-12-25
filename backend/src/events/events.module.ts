import { Module } from '@nestjs/common';
import { UserAnsweredCorrectlyListener } from './listeners/answered-correctly.listener';

@Module({
  providers: [UserAnsweredCorrectlyListener],
})
export class EventsModule {}
