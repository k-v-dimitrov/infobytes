import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserFeedDto } from './dto';
import { Fact } from '@prisma/client';

@Injectable()
export class FeedService {
  constructor(private db: DatabaseService) {}

  async subscribeUserToFeed() {
    const user = await this.db.feedUser.create({ data: {} });
    return { userId: user.id };
  }

  async getFeedForUser({ userId, size = 5 }: UserFeedDto) {
    const viewedFactIdsByUser =
      await this.getFactsIdsViewedByCurrentUser(userId);

    const currentUserFeed = await this.generateFeedForUser({
      excludeFactIds: viewedFactIdsByUser,
      size,
      shouldRandomize: true,
    });

    await this.markFactsAsViewed(currentUserFeed, userId);

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

  private async markFactsAsViewed(factsFeed, userId: string) {
    const factsFeedAndCurrentUserIds = factsFeed.map(({ id }) => ({
      fact_id: id,
      user_id: userId,
    }));

    await this.db.viewedFact.createMany({
      data: factsFeedAndCurrentUserIds,
    });
  }

  private async getFactsIdsViewedByCurrentUser(userId: string) {
    const alreadySeenFactsByUser = await this.db.viewedFact.findMany({
      where: { user_id: userId },
    });

    // get all facts count
    const { _count: allFactsCount } = await this.db.fact.aggregate({
      _count: true,
    });

    const hasSeenAll = alreadySeenFactsByUser.length === allFactsCount;

    if (hasSeenAll) {
      await this.db.viewedFact.deleteMany({ where: { user_id: userId } });
      return [];
    }

    const alreadySeenFactsByUserIds = alreadySeenFactsByUser.map(
      ({ fact_id }) => fact_id,
    );

    return alreadySeenFactsByUserIds;
  }
}
