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
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CreateExpenseSchema, UpdateExpenseSchema } from './expenses.schemas';
import type {
  CreateExpenseRequest,
  UpdateExpenseRequest,
} from './expenses.schemas';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private service: ExpensesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateExpenseSchema))
  create(
    @CurrentUser() user: { id: string; email: string },
    @Body() body: CreateExpenseRequest,
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
  @UsePipes(new ZodValidationPipe(UpdateExpenseSchema))
  update(
    @CurrentUser() user: { id: string; email: string },
    @Param('id') id: string,
    @Body() body: UpdateExpenseRequest,
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
