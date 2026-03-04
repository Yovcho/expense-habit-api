import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesRepo {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a user-owned category
   */
  createForUser(
    userId: string,
    data: {
      name: string;
    },
  ): Promise<Category> {
    return this.prisma.category.create({
      data: {
        userId,
        name: data.name,
        isArchived: false,
      },
    });
  }

  /**
   * Get all categories accessible to user: global categories + user's own categories
   * Optionally filter out archived categories
   */
  listForUser(userId: string, includeArchived = false): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: includeArchived
        ? {
            OR: [{ userId: null }, { userId }],
          }
        : {
            OR: [
              { userId: null, isArchived: false },
              { userId, isArchived: false },
            ],
          },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Find category by ID and verify it belongs to user (or is global)
   */
  findByIdForUser(userId: string, id: string): Promise<Category | null> {
    return this.prisma.category.findFirst({
      where: {
        id,
        OR: [{ userId: null }, { userId }],
      },
    });
  }

  /**
   * Find category by ID - does not perform user scope check (use in internal validations)
   */
  findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  /**
   * Update category - should only be called after verifying user ownership
   */
  updateById(
    id: string,
    data: Partial<{
      name: string;
      isArchived: boolean;
    }>,
  ): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete category - should only be called after verifying user ownership
   */
  deleteById(id: string): Promise<Category> {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  /**
   * Check if category is used by any expense for a given user
   */
  async isCategoryUsedByUser(userId: string, categoryId: string): Promise<boolean> {
    const count = await this.prisma.expense.count({
      where: {
        userId,
        categoryId,
      },
    });
    return count > 0;
  }

  /**
   * Get a global category by name (for seeding checks)
   */
  findGlobalByName(name: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: {
        userId_name: {
          userId: null as any, // Prisma allows null in compound keys
          name,
        },
      },
    });
  }
}
