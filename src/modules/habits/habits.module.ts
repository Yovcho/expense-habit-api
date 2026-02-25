import { Module } from '@nestjs/common';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';
import { HabitsRepo } from './habits.repo';

@Module({
  controllers: [HabitsController],
  providers: [HabitsService, HabitsRepo],
})
export class HabitsModule {}
