import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Habit } from '@prisma/client';

@Injectable()
export class HabitsRepo {
  constructor(private prisma: PrismaService) {}

  createForUser(
    userId: string,
    data: {
      name: string;
      frequency?: 'DAILY' | 'WEEKLY';
      targetCount?: number;
      isActive?: boolean;
    },
  ): Promise<Habit> {
    return this.prisma.habit.create({
      data: {
        userId,
        name: data.name,
        frequency: data.frequency || 'DAILY',
        targetCount: data.targetCount || 1,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
  }

  listForUser(userId: string): Promise<Habit[]> {
    return this.prisma.habit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findByIdForUser(userId: string, id: string): Promise<Habit | null> {
    return this.prisma.habit.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  updateById(
    id: string,
    data: Partial<{
      name: string;
      frequency: 'DAILY' | 'WEEKLY';
      targetCount: number;
      isActive: boolean;
    }>,
  ): Promise<Habit> {
    return this.prisma.habit.update({
      where: { id },
      data,
    });
  }

  deleteById(id: string): Promise<Habit> {
    return this.prisma.habit.delete({
      where: { id },
    });
  }
}
