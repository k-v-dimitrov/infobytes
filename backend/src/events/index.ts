import { UserAnsweredCorrectlyEventPayload } from './payloads/asnwered-correctly.event';
import { UserLevelUpEventPayload } from './payloads/user-level-up.event';

enum INTERNAL {
  userLevelUp = 'I_USER_LEVEL_UP',
  userAnsweredCorrectly = 'I_USER_ANSWER_CORRECT',
}

enum APP {
  userLevelUp = 'USER_LEVEL_UP',
  userChangeInXP = 'USER_CHANGE_IN_XP',
}

export const Events = {
  INTERNAL,
  APP,
  PAYLOADS: { UserAnsweredCorrectlyEventPayload, UserLevelUpEventPayload },
} as const;
