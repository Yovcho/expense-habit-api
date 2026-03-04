import { Module } from '@nestjs/common';
import { CheckinsController } from './checkins.controller';
import { CheckinsService } from './checkins.service';
import { CheckinsRepo } from './checkins.repo';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CheckinsController],
  providers: [CheckinsService, CheckinsRepo],
  exports: [CheckinsService, CheckinsRepo],
})
export class CheckinsModule {}
