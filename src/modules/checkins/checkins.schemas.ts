import { z } from 'zod';

export const UpsertCheckInSchema = z.object({
  day: z.iso.datetime('Must be a valid ISO datetime string'),
  count: z
    .number()
    .int()
    .positive('Count must be a positive integer')
    .optional()
    .default(1),
});

export const ListCheckInsQuerySchema = z.object({
  from: z.iso.datetime('Must be a valid ISO datetime string').optional(),
  to: z.iso.datetime('Must be a valid ISO datetime string').optional(),
});

export type UpsertCheckInRequest = z.infer<typeof UpsertCheckInSchema>;
export type ListCheckInsQuery = z.infer<typeof ListCheckInsQuerySchema>;
