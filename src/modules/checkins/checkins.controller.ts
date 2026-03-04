import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CheckinsService } from './checkins.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  UpsertCheckInSchema,
  ListCheckInsQuerySchema,
} from './checkins.schemas';
import type {
  UpsertCheckInRequest,
  ListCheckInsQuery,
} from './checkins.schemas';

@Controller('habits/:habitId/checkins')
@UseGuards(JwtAuthGuard)
export class CheckinsController {
  constructor(private service: CheckinsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(UpsertCheckInSchema))
  upsert(
    @CurrentUser() user: { id: string; email: string },
    @Param('habitId') habitId: string,
    @Body() body: UpsertCheckInRequest,
  ) {
    return this.service.upsert(user.id, habitId, body);
  }

  @Get()
  @UsePipes(new ZodValidationPipe(ListCheckInsQuerySchema))
  list(
    @CurrentUser() user: { id: string; email: string },
    @Param('habitId') habitId: string,
    @Query() query: ListCheckInsQuery,
  ) {
    return this.service.list(user.id, habitId, query);
  }

  @Delete(':id')
  async delete(
    @CurrentUser() user: { id: string; email: string },
    @Param('habitId') habitId: string,
    @Param('id') id: string,
  ) {
    await this.service.remove(user.id, id);
    return { id, deleted: true };
  }
}
