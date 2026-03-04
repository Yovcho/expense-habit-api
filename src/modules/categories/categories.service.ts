import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { CategoriesRepo } from './categories.repo';
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from './categories.schemas';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private repo: CategoriesRepo) {}

  /**
   * Create a new user-owned category
   */
  async create(userId: string, dto: CreateCategoryRequest): Promise<Category> {
    return this.repo.createForUser(userId, {
      name: dto.name,
    });
  }

  /**
   * List categories accessible to user (global + user's own)
   */
  async list(userId: string, includeArchived = false): Promise<Category[]> {
    return this.repo.listForUser(userId, includeArchived);
  }

  /**
   * Get a single category by ID
   */
  async get(userId: string, id: string): Promise<Category> {
    const category = await this.repo.findByIdForUser(userId, id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  /**
   * Update a category - only allows updating user-owned categories
   */
  async update(
    userId: string,
    id: string,
    dto: UpdateCategoryRequest,
  ): Promise<Category> {
    // Verify the category exists and is accessible to user
    const category = await this.repo.findByIdForUser(userId, id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Prevent modification of global categories
    if (category.userId === null) {
      throw new ForbiddenException('Cannot modify global categories');
    }

    // Build update data
    const updateData: Partial<{
      name: string;
      isArchived: boolean;
    }> = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.isArchived !== undefined) updateData.isArchived = dto.isArchived;

    return this.repo.updateById(id, updateData);
  }

  /**
   * Delete a category - only allows deleting user-owned categories
   * Archives instead if category is in use by any expense
   */
  async remove(userId: string, id: string): Promise<Category> {
    // Verify the category exists and is accessible to user
    const category = await this.repo.findByIdForUser(userId, id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Prevent deletion of global categories
    if (category.userId === null) {
      throw new ForbiddenException('Cannot delete global categories');
    }

    // Check if category is in use - if so, archive instead of delete
    const isInUse = await this.repo.isCategoryUsedByUser(userId, id);
    if (isInUse) {
      // Archive the category instead of deleting it
      return this.repo.updateById(id, { isArchived: true });
    }

    // Safe to delete if not in use
    return this.repo.deleteById(id);
  }

  /**
   * Validate that a category exists, is not archived, and is accessible to user
   * Useful for validating categoryId when creating/updating expenses
   */
  async validateCategoryForUser(userId: string, categoryId: string): Promise<Category> {
    const category = await this.repo.findByIdForUser(userId, categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    if (category.isArchived) {
      throw new ConflictException('Category is archived');
    }
    return category;
  }
}
