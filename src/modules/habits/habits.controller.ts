import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CreateHabitSchema, UpdateHabitSchema } from './habits.schemas';
import type { CreateHabitRequest, UpdateHabitRequest } from './habits.schemas';

@Controller('habits')
@UseGuards(JwtAuthGuard)
export class HabitsController {
  constructor(private service: HabitsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateHabitSchema))
  create(
    @CurrentUser() user: { id: string; email: string },
    @Body() body: CreateHabitRequest,
  ) {
    return this.service.create(user.id, body);
  }

  @Get()
  list(@CurrentUser() user: { id: string; email: string }) {
    return this.service.list(user.id);
  }

  @Get(':id')
  get(
    @CurrentUser() user: { id: string; email: string },
    @Param('id') id: string,
  ) {
    return this.service.get(user.id, id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateHabitSchema))
  update(
    @CurrentUser() user: { id: string; email: string },
    @Param('id') id: string,
    @Body() body: UpdateHabitRequest,
  ) {
    return this.service.update(user.id, id, body);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: { id: string; email: string },
    @Param('id') id: string,
  ) {
    return this.service.remove(user.id, id);
  }
}
