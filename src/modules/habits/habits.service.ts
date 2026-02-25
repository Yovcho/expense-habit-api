import { Injectable, NotFoundException } from '@nestjs/common';
import { HabitsRepo } from './habits.repo';
import type {
  CreateHabitRequest,
  UpdateHabitRequest,
} from './habits.schemas';
import { Habit } from '@prisma/client';

@Injectable()
export class HabitsService {
  constructor(private repo: HabitsRepo) {}

  create(userId: string, dto: CreateHabitRequest): Promise<Habit> {
    return this.repo.createForUser(userId, {
      name: dto.name,
      frequency: dto.frequency,
      targetCount: dto.targetCount,
      isActive: dto.isActive,
    });
  }

  list(userId: string): Promise<Habit[]> {
    return this.repo.listForUser(userId);
  }

  async get(userId: string, id: string): Promise<Habit> {
    const habit = await this.repo.findByIdForUser(userId, id);
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }
    return habit;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateHabitRequest,
  ): Promise<Habit> {
    // Check ownership
    const habit = await this.repo.findByIdForUser(userId, id);
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    // Build update data
    const updateData: Partial<{
      name: string;
      frequency: 'DAILY' | 'WEEKLY';
      targetCount: number;
      isActive: boolean;
    }> = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.frequency !== undefined) updateData.frequency = dto.frequency;
    if (dto.targetCount !== undefined) updateData.targetCount = dto.targetCount;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    return this.repo.updateById(id, updateData);
  }

  async remove(userId: string, id: string): Promise<Habit> {
    // Check ownership
    const habit = await this.repo.findByIdForUser(userId, id);
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    return this.repo.deleteById(id);
  }
}
