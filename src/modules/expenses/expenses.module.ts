import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { ExpensesRepo } from './expenses.repo';

@Module({
  controllers: [ExpensesController],
  providers: [ExpensesService, ExpensesRepo],
})
export class ExpensesModule {}
