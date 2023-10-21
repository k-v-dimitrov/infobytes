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
} from '@nestjs/common';
import { FactService } from './fact.service';
import {
  CreateFactDto,
  FactIdDto,
  PatchFactDto,
  PutFactDto,
  SearchFactDto,
} from './dto';

@Controller('fact')
export class FactController {
  constructor(private factService: FactService) {}

  // Create
  @Post()
  create(@Body() dto: CreateFactDto) {
    return this.factService.create(dto);
  }

  // Read
  @Get(':id')
  get(@Param() factId: FactIdDto) {
    return this.factService.get(factId);
  }

  // Update
  @Put()
  put(@Body() dto: PutFactDto) {
    return this.factService.put(dto);
  }

  @Patch()
  patch(@Body() dto: PatchFactDto) {
    return this.factService.patch(dto);
  }

  // Delete
  @Delete(':id')
  delete(@Param() factId: FactIdDto) {
    return this.factService.delete(factId);
  }

  @Get()
  factsSearch(@Query() searchDto: SearchFactDto) {
    return this.factService.search(searchDto.search);
  }
}
