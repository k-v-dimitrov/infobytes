import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  AnswerFeedQuestionDto,
  AnswerFeedQuestionRouteParams,
  UserFeedDto,
  UserFeedResponseDto,
} from './dto';
import { Fact, Prisma, Question, User, ViewedFact } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaError } from 'prisma-error-enum';
import {
  InvalidAnswerIdException,
  UserFeedQuestionAlreadyAnsweredException,
} from './exceptions';
import { mergeAndShuffleArrays } from 'src/utils/mergeAndShuffleArrays';

// Enrich user feed on every 5 viewed facts
const ENRICH_WITH_QUESTION_INTERVAL = 5;

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

    const factsFeed = await this.generateFactsFeedForUser({
      excludeFactIds: viewedFactIdsByUser,
      size,
      shouldRandomize: true,
    });

    const { beforeUpdateViewedCount, afterUpdateViewedCount } =
      await this.markFactsAsViewedAndGetUpdatedCounts(userFeedId, factsFeed);

    const numberOfQuestionsToGenerate =
      this.calculateNumberOfQuestionsToGenerate({
        beforeUpdateViewedCount,
        afterUpdateViewedCount,
      });

    const questionsFeed = await this.generateQuestionsFeed(
      numberOfQuestionsToGenerate,
      userFeedId,
    );

    const feedResponse = plainToInstance(
      UserFeedResponseDto,
      {
        facts: factsFeed,
        questions: questionsFeed,
      },
      { excludeExtraneousValues: true },
    );

    return mergeAndShuffleArrays(feedResponse.facts, feedResponse.questions);
  }

  async answerFeedQuestion(
    { userQuestionId }: AnswerFeedQuestionRouteParams,
    { answerId }: AnswerFeedQuestionDto,
  ) {
    const userQuestion = await this.getUserQuestionById(userQuestionId);

    this.validateQuestionNotAnswered(userQuestion);
    this.validateProvidedAnswerToQuestion(userQuestion, answerId);

    const answerToQuestion = userQuestion.question.answers.find(
      ({ id }) => answerId === id,
    );

    await this.db.userQuestion.update({
      data: {
        givenAnswerId: answerToQuestion.id,
        isCorrect: answerToQuestion.isCorrect,
      },
      where: { id: userQuestion.id },
    });

    return { isCorrect: answerToQuestion.isCorrect };
  }

  private validateQuestionNotAnswered(
    userQuestion: Prisma.UserQuestionGetPayload<{
      include: { question: { include: { answers: true } } };
    }>,
  ) {
    if (userQuestion.givenAnswerId) {
      throw new UserFeedQuestionAlreadyAnsweredException();
    }
  }

  private validateProvidedAnswerToQuestion(
    userQuestion: Prisma.UserQuestionGetPayload<{
      include: { question: { include: { answers: true } } };
    }>,
    answerId: string,
  ) {
    const questionHasSuchAnswer = !!userQuestion.question.answers.find(
      ({ id }) => answerId === id,
    );

    if (!questionHasSuchAnswer) {
      throw new InvalidAnswerIdException();
    }
  }

  private async getUserQuestionById(userQuestionId: string) {
    try {
      return await this.db.userQuestion.findFirstOrThrow({
        where: { id: userQuestionId },
        include: { question: { include: { answers: true } } },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === PrismaError.RecordsNotFound) {
          throw new NotFoundException();
        }
      }

      throw err;
    }
  }

  private async generateQuestionsFeed(
    numberOfQuestionsToInject: number,
    userFeedId: string,
  ) {
    const randomAlreadyViewedFacts = await this.getRandomViewedFacts({
      count: numberOfQuestionsToInject,
    });

    const questionsByAlreadyViewedFacts =
      await this.getQuestionsOfAlreadyViewedFacts(randomAlreadyViewedFacts);

    const { user } = await this.getUserByUserFeedId(userFeedId);

    const feedQuestions = await this.db.$transaction(
      questionsByAlreadyViewedFacts.map(
        ({ Question: questionAssocidatedWithViewedFact }) => {
          const randomQuestionFromViewedFact =
            questionAssocidatedWithViewedFact[
              Math.floor(
                Math.random() * questionAssocidatedWithViewedFact.length,
              )
            ];

          return this.createNewUserQuestion(randomQuestionFromViewedFact, user);
        },
      ),
    );

    const enrichedFeedQuestions =
      this.attachAnswerURIToQuestions(feedQuestions);

    return enrichedFeedQuestions;
  }

  private createNewUserQuestion(question: Question, user: User) {
    return this.db.userQuestion.create({
      data: {
        user: { connect: { id: user.id } },
        question: {
          connect: {
            id: question.id,
          },
        },
        givenAnswerId: null,
        isCorrect: null,
      },
      include: {
        question: { include: { answers: true } },
      },
    });
  }

  private attachAnswerURIToQuestions(
    feedQuestions: Prisma.UserQuestionGetPayload<{
      include: { question: { include: { answers: true } } };
    }>[],
  ) {
    return feedQuestions.map((fq) => ({
      ...fq,
      question: {
        ...fq.question,
        answerURI: `/feed/q/${fq.id}`,
      },
    }));
  }

  private async getRandomViewedFacts({ count }: { count: number }) {
    return await this.db.$queryRawUnsafe<ViewedFact[]>(
      `
        select * from viewed_facts vf 
        where vf.user_feed_id = 'a80a4e27-f19a-48eb-b482-c43d983718be'
        order by random()
        limit $1
      `,
      count,
    );
  }

  private async getQuestionsOfAlreadyViewedFacts(
    alreadyViewedFacts: ViewedFact[],
  ) {
    return await this.db.fact.findMany({
      select: {
        Question: true,
      },
      where: {
        id: { in: alreadyViewedFacts.map(({ fact_id }) => fact_id) },
      },
    });
  }

  private async getUserByUserFeedId(userFeedId: string) {
    return await this.db.feedUser.findFirstOrThrow({
      where: { id: userFeedId },
      include: { user: true },
    });
  }

  private async markFactsAsViewedAndGetUpdatedCounts(
    userFeedId: string,
    currentUserFeed: Fact[],
  ) {
    const beforeUpdateViewedCount = await this.getViewedFactsCount(userFeedId);

    await this.markFactsAsViewed(currentUserFeed, userFeedId);

    const afterUpdateViewedCount = await this.getViewedFactsCount(userFeedId);
    return { beforeUpdateViewedCount, afterUpdateViewedCount };
  }

  private async generateFactsFeedForUser({
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

  private async getViewedFactsCount(userFeedId: string) {
    return this.db.viewedFact.count({ where: { user_feed_id: userFeedId } });
  }

  private calculateNumberOfQuestionsToGenerate({
    beforeUpdateViewedCount,
    afterUpdateViewedCount,
  }: {
    beforeUpdateViewedCount: number;
    afterUpdateViewedCount: number;
  }) {
    return new Array(afterUpdateViewedCount - beforeUpdateViewedCount)
      .fill(0)
      .map((_, i) => beforeUpdateViewedCount + i)
      .filter(
        (viewedFactIndex) =>
          viewedFactIndex % ENRICH_WITH_QUESTION_INTERVAL === 0,
      ).length;
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
      await this.resetUserViewedFacts(userFeedId);
      return [];
    }

    const alreadySeenFactsByUserIds = alreadySeenFactsByUser.map(
      ({ fact_id }) => fact_id,
    );

    return alreadySeenFactsByUserIds;
  }

  private async resetUserViewedFacts(userFeedId: string) {
    await this.db.viewedFact.deleteMany({
      where: { user_feed_id: userFeedId },
    });
  }
}
