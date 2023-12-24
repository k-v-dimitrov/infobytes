import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { FactModule } from './fact/fact.module';
import { CategoryModule } from './category/category.module';
import { FeedModule } from './feed/feed.module';
import { AuthModule } from './auth/auth.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SendGridModule } from './sendgrid/sendgrid.module';
import { UserModule } from './user/user.module';
import { QuestionModule } from './question/question.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
      serveStaticOptions: {
        index: '/index.html',
      },
    }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UserModule,
    FactModule,
    CategoryModule,
    QuestionModule,
    SendGridModule,
    FeedModule,
  ],
})
export class AppModule {}
