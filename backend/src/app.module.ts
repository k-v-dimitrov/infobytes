import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { FactModule } from './fact/fact.module';
import { CategoryModule } from './category/category.module';
import { FeedModule } from './feed/feed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    FactModule,
    CategoryModule,
    FeedModule,
  ],
})
export class AppModule {}
