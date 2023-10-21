import { Injectable } from '@nestjs/common';
import { FactCategories } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CategoryService {
  constructor(private db: DatabaseService) {}

  getAllCategories() {
    return Object.keys(FactCategories);
  }

  getAllFactsByCategory(categoryType: FactCategories) {
    return this.db.fact.findMany({ where: { categoryType: categoryType } });
  }
}
