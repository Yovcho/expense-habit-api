import { z } from 'zod';

export const CreateExpenseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amountCents: z.number().int().positive('Amount must be a positive integer'),
  currency: z.string().length(3, 'Currency must be 3 characters').optional(),
  categoryId: z.string().min(1, 'Category ID is required'),
  occurredAt: z.string().datetime('Invalid datetime format'),
});

export const UpdateExpenseSchema = CreateExpenseSchema.partial();

export type CreateExpenseRequest = z.infer<typeof CreateExpenseSchema>;
export type UpdateExpenseRequest = z.infer<typeof UpdateExpenseSchema>;
