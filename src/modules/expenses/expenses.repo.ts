import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Expense } from '@prisma/client';

@Injectable()
export class ExpensesRepo {
  constructor(private prisma: PrismaService) {}

  createForUser(
    userId: string,
    data: {
      title: string;
      amountCents: number;
      currency?: string;
      category: string;
      occurredAt: Date;
    },
  ): Promise<Expense> {
    return this.prisma.expense.create({
      data: {
        userId,
        title: data.title,
        amountCents: data.amountCents,
        currency: data.currency || 'EUR',
        category: data.category,
        occurredAt: data.occurredAt,
      },
    });
  }

  listForUser(userId: string): Promise<Expense[]> {
    return this.prisma.expense.findMany({
      where: { userId },
      orderBy: { occurredAt: 'desc' },
    });
  }

  findByIdForUser(userId: string, id: string): Promise<Expense | null> {
    return this.prisma.expense.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  updateById(
    id: string,
    data: Partial<{
      title: string;
      amountCents: number;
      currency: string;
      category: string;
      occurredAt: Date;
    }>,
  ): Promise<Expense> {
    return this.prisma.expense.update({
      where: { id },
      data,
    });
  }

  deleteById(id: string): Promise<Expense> {
    return this.prisma.expense.delete({
      where: { id },
    });
  }
}
