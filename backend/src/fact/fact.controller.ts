import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FactService } from './fact.service';
import {
  CreateFactDto,
  FactIdDto,
  PatchFactDto,
  PutFactDto,
  SearchFactDto,
} from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('fact')
export class FactController {
  constructor(private factService: FactService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  get(@Param() factId: FactIdDto) {
    return this.factService.get(factId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
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
  @Delete(':id')
  delete(@Param() factId: FactIdDto) {
    return this.factService.delete(factId);
  }
}
