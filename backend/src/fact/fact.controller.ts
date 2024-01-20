import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  AddFactForReviewDto,
  CreateFactDto,
  DeleteFactForReviewDto,
  FactIdDto,
  PatchFactDto,
  PutFactDto,
  SearchFactDto,
} from './dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser, InjectUser } from 'src/interceptors';

import { UserService } from 'src/user/user.service';
import { FactService } from './fact.service';
import { PageableParamsDto } from 'src/utils/pageable';
import { User } from '@prisma/client';
import { UseAllAuthGuards } from 'src/utils/UseAllAuthGuards';

@Controller('fact')
export class FactController {
  constructor(
    private factService: FactService,
    private userService: UserService,
  ) {}

  @Get()
  @UseAllAuthGuards()
  get(@Query() factId: FactIdDto) {
    return this.factService.get(factId);
  }

  @Get()
  @UseAllAuthGuards()
  search(@Query() searchDto: SearchFactDto) {
    return this.factService.search(searchDto.search);
  }

  @UseGuards(AuthGuard('admin'))
  @Post()
  create(@Body() dto: CreateFactDto) {
    return this.factService.create(dto);
  }

  @UseGuards(AuthGuard('admin'))
  @Put()
  put(@Body() dto: PutFactDto) {
    return this.factService.put(dto);
  }

  @UseGuards(AuthGuard('admin'))
  @Patch()
  patch(@Body() dto: PatchFactDto) {
    return this.factService.patch(dto);
  }

  @UseGuards(AuthGuard('admin'))
  @Delete()
  delete(@Query() factId: FactIdDto) {
    return this.factService.delete(factId);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(InjectUser)
  @Get('review')
  getFactsForReview(@Body() dto: PageableParamsDto, @CurrentUser() user: User) {
    return this.factService.getFactsForReview(dto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(InjectUser)
  @Post('review')
  addFactForReview(
    @Body() dto: AddFactForReviewDto,
    @CurrentUser() user: User,
  ) {
    return this.userService.addFactForReview(dto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(InjectUser)
  @Delete('review')
  deleteFactForReview(
    @Query() dto: DeleteFactForReviewDto,
    @CurrentUser() user: User,
  ) {
    return this.userService.deleteFactForReview(dto, user);
  }
}
