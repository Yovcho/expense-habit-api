import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesRepo } from './categories.repo';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepo],
  exports: [CategoriesService, CategoriesRepo], // Export for use by other modules (e.g., expenses)
})
export class CategoriesModule {}
