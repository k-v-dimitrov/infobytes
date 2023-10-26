import { Module } from '@nestjs/common';
import { FactService } from './fact.service';
import { FactController } from './fact.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule],
  providers: [FactService],
  controllers: [FactController],
})
export class FactModule {}
