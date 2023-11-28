import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateQuestionDto, DeleteQuestionDto } from './dto';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @UseGuards(AuthGuard('admin'))
  @Post()
  create(@Body() dto: CreateQuestionDto) {
    return this.questionService.create(dto);
  }

  @UseGuards(AuthGuard('admin'))
  @Delete()
  delete(@Body() dto: DeleteQuestionDto) {
    return this.questionService.delete(dto);
  }
}
