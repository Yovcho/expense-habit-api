import { z } from 'zod';

export const CreateHabitSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  frequency: z.enum(['DAILY', 'WEEKLY']).optional().default('DAILY'),
  targetCount: z.number().int().positive('Target count must be a positive integer').optional().default(1),
  isActive: z.boolean().optional().default(true),
});

export const UpdateHabitSchema = CreateHabitSchema.partial();

export type CreateHabitRequest = z.infer<typeof CreateHabitSchema>;
export type UpdateHabitRequest = z.infer<typeof UpdateHabitSchema>;
