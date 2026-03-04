import { Injectable, NotFoundException } from '@nestjs/common';
import { CheckinsRepo } from './checkins.repo';
import type {
  UpsertCheckInRequest,
  ListCheckInsQuery,
} from './checkins.schemas';
import { HabitCheckIn } from '@prisma/client';

@Injectable()
export class CheckinsService {
  constructor(private repo: CheckinsRepo) {}

  /**
   * Normalize an ISO date string to UTC midnight (Date object)
   */
  private normalizeDay(dateString: string): Date {
    const d = new Date(dateString);
    return new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
    );
  }

  /**
   * Upsert a check-in for a user's habit and day
   */
  async upsert(
    userId: string,
    habitId: string,
    dto: UpsertCheckInRequest,
  ): Promise<HabitCheckIn> {
    // Verify habit belongs to user
    const habit = await this.repo.findHabitForUser(userId, habitId);
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    // Normalize day to UTC midnight
    const normalizedDay = this.normalizeDay(dto.day);

    // Upsert check-in
    return this.repo.upsertForUserHabitDay(
      userId,
      habitId,
      normalizedDay,
      dto.count ?? 1,
    );
  }

  /**
   * List check-ins for a user's habit within optional date range
   */
  async list(
    userId: string,
    habitId: string,
    query: ListCheckInsQuery,
  ): Promise<HabitCheckIn[]> {
    // Verify habit belongs to user
    const habit = await this.repo.findHabitForUser(userId, habitId);
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    // Parse from/to dates if provided
    const from = query.from ? new Date(query.from) : undefined;
    const to = query.to ? new Date(query.to) : undefined;

    return this.repo.listForUserHabit(userId, habitId, from, to);
  }

  /**
   * Delete a check-in by id, ensuring ownership
   */
  async remove(userId: string, id: string): Promise<void> {
    const deleted = await this.repo.deleteForUser(userId, id);
    if (!deleted) {
      throw new NotFoundException('Check-in not found');
    }
  }
}
