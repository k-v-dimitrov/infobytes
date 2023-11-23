import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserFeedDto } from './dto';
import { Fact, User } from '@prisma/client';

@Injectable()
export class FeedService {
  constructor(private db: DatabaseService) {}

  async subscribeUserToFeed(user: User) {
    const feedUser = await this.db.feedUser.create({
      data: { user_id: user.id },
    });
    return { feedUserId: feedUser.id };
  }

  async getFeedForUser({ userFeedId, size = 5 }: UserFeedDto) {
    const viewedFactIdsByUser =
      await this.getFactsIdsViewedByCurrentUser(userFeedId);

    const currentUserFeed = await this.generateFeedForUser({
      excludeFactIds: viewedFactIdsByUser,
      size,
      shouldRandomize: true,
    });

    await this.markFactsAsViewed(currentUserFeed, userFeedId);

    return currentUserFeed;
  }

  private async generateFeedForUser({
    excludeFactIds,
    size,
    shouldRandomize = false,
  }: {
    excludeFactIds: string[];
    size: number;
    shouldRandomize: boolean;
  }) {
    const excludeFactsIdsSqlLiteral =
      shouldRandomize && excludeFactIds && excludeFactIds.length > 0
        ? `where facts.id not in (${excludeFactIds
            .map((id) => `'${id}' `)
            .join(',')})`
        : '';

    const factsFeed = await this.db.$queryRawUnsafe<Fact[]>(
      `
      select * from facts
      ${excludeFactsIdsSqlLiteral}
      order by random()
      limit $1
    `,
      size,
    );

    return factsFeed;
  }

  private async markFactsAsViewed(factsFeed: Fact[], userFeedId: string) {
    const factsFeedAndCurrentUserIds = factsFeed.map(({ id }) => ({
      fact_id: id,
      user_feed_id: userFeedId,
    }));

    await this.db.viewedFact.createMany({
      data: factsFeedAndCurrentUserIds,
    });
  }

  private async getFactsIdsViewedByCurrentUser(userFeedId: string) {
    const alreadySeenFactsByUser = await this.db.viewedFact.findMany({
      where: { user_feed_id: userFeedId },
    });

    // get all facts count
    const { _count: allFactsCount } = await this.db.fact.aggregate({
      _count: true,
    });

    const hasSeenAll = alreadySeenFactsByUser.length === allFactsCount;

    if (hasSeenAll) {
      await this.db.viewedFact.deleteMany({
        where: { user_feed_id: userFeedId },
      });
      return [];
    }

    const alreadySeenFactsByUserIds = alreadySeenFactsByUser.map(
      ({ fact_id }) => fact_id,
    );

    return alreadySeenFactsByUserIds;
  }
}
