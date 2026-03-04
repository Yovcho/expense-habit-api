import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { HabitCheckIn } from '@prisma/client';

@Injectable()
export class CheckinsRepo {
  constructor(private prisma: PrismaService) {}

  /**
   * Find a habit by id and ensure it belongs to the user
   */
  findHabitForUser(userId: string, habitId: string) {
    return this.prisma.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
    });
  }

  /**
   * Upsert a check-in for a user's habit on a specific day (UTC midnight normalized)
   */
  upsertForUserHabitDay(
    userId: string,
    habitId: string,
    day: Date,
    count: number,
  ): Promise<HabitCheckIn> {
    return this.prisma.habitCheckIn.upsert({
      where: {
        userId_habitId_day: {
          userId,
          habitId,
          day,
        },
      },
      create: {
        userId,
        habitId,
        day,
        count,
      },
      update: {
        count,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * List check-ins for a user's habit within optional date range
   */
  listForUserHabit(
    userId: string,
    habitId: string,
    from?: Date,
    to?: Date,
  ): Promise<HabitCheckIn[]> {
    return this.prisma.habitCheckIn.findMany({
      where: {
        userId,
        habitId,
        day: {
          ...(from && { gte: from }),
          ...(to && { lte: to }),
        },
      },
      orderBy: { day: 'asc' },
    });
  }

  /**
   * Delete a check-in by id, ensuring ownership by userId
   */
  async deleteForUser(userId: string, id: string): Promise<boolean> {
    const result = await this.prisma.habitCheckIn.deleteMany({
      where: {
        id,
        userId,
      },
    });
    return result.count > 0;
  }
}
