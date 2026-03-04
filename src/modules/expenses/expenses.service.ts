import { Injectable, NotFoundException } from '@nestjs/common';
import { ExpensesRepo } from './expenses.repo';
import { CategoriesService } from '../categories/categories.service';
import type {
  CreateExpenseRequest,
  UpdateExpenseRequest,
} from './expenses.schemas';
import { Expense } from '@prisma/client';

@Injectable()
export class ExpensesService {
  constructor(
    private repo: ExpensesRepo,
    private categoriesService: CategoriesService,
  ) {}

  async create(userId: string, dto: CreateExpenseRequest): Promise<Expense> {
    // Validate that the category exists and is accessible to user
    await this.categoriesService.validateCategoryForUser(
      userId,
      dto.categoryId,
    );

    return this.repo.createForUser(userId, {
      title: dto.title,
      amountCents: dto.amountCents,
      currency: dto.currency,
      categoryId: dto.categoryId,
      occurredAt: new Date(dto.occurredAt),
    });
  }

  list(userId: string): Promise<Expense[]> {
    return this.repo.listForUser(userId);
  }

  async get(userId: string, id: string): Promise<Expense> {
    const expense = await this.repo.findByIdForUser(userId, id);
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateExpenseRequest,
  ): Promise<Expense> {
    // Check ownership
    const expense = await this.repo.findByIdForUser(userId, id);
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    // Validate categoryId if provided
    if (dto.categoryId !== undefined) {
      await this.categoriesService.validateCategoryForUser(
        userId,
        dto.categoryId,
      );
    }

    // Build update data
    const updateData: Partial<{
      title: string;
      amountCents: number;
      currency: string;
      categoryId: string;
      occurredAt: Date;
    }> = {};

    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.amountCents !== undefined) updateData.amountCents = dto.amountCents;
    if (dto.currency !== undefined) updateData.currency = dto.currency;
    if (dto.categoryId !== undefined) updateData.categoryId = dto.categoryId;
    if (dto.occurredAt !== undefined)
      updateData.occurredAt = new Date(dto.occurredAt);

    return this.repo.updateById(id, updateData);
  }

  async remove(userId: string, id: string): Promise<Expense> {
    // Check ownership
    const expense = await this.repo.findByIdForUser(userId, id);
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return this.repo.deleteById(id);
  }
}
