import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryTypeDto } from './dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Get('all')
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':category')
  getAllFactsByCategory(@Param() dto: CategoryTypeDto) {
    return this.categoryService.getAllFactsByCategory(dto.category);
  }
}
