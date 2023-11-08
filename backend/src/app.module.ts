import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { FactModule } from './fact/fact.module';
import { CategoryModule } from './category/category.module';
import { FeedModule } from './feed/feed.module';
import { AuthModule } from './auth/auth.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    FactModule,
    CategoryModule,
    FeedModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
      serveStaticOptions: {
        index: '/index.html',
      },
    }),
  ],
})
export class AppModule {}
