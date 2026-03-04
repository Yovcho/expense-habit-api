import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from './categories.schemas';
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from './categories.schemas';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  /**
   * Create a new user-owned category
   */
  @Post()
  @UsePipes(new ZodValidationPipe(CreateCategorySchema))
  create(
    @CurrentUser() user: { id: string; email: string },
    @Body() body: CreateCategoryRequest,
  ) {
    return this.service.create(user.id, body);
  }

  /**
   * List all categories accessible to user (global + user's own)
   * Optional query: ?includeArchived=true to include archived categories
   */
  @Get()
  list(
    @CurrentUser() user: { id: string; email: string },
    @Query('includeArchived') includeArchived?: string,
  ) {
    const shouldIncludeArchived = includeArchived === 'true';
    return this.service.list(user.id, shouldIncludeArchived);
  }

  /**
   * Get a single category by ID
   */
  @Get(':id')
  get(
    @CurrentUser() user: { id: string; email: string },
    @Param('id') id: string,
  ) {
    return this.service.get(user.id, id);
  }

  /**
   * Update a category (name, isArchived)
   * Only allows updating user-owned categories
   */
  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateCategorySchema))
  update(
    @CurrentUser() user: { id: string; email: string },
    @Param('id') id: string,
    @Body() body: UpdateCategoryRequest,
  ) {
    return this.service.update(user.id, id, body);
  }

  /**
   * Delete a category
   * Only allows deleting user-owned categories
   * Archives category if it's in use (soft delete for safety)
   */
  @Delete(':id')
  remove(
    @CurrentUser() user: { id: string; email: string },
    @Param('id') id: string,
  ) {
    return this.service.remove(user.id, id);
  }
}
