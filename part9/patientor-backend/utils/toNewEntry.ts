import { z } from 'zod';

export const NewEntrySchema = z.object({
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
  type: z.enum(['Hospital', 'OccupationalHealthcare', 'HealthCheck']),
  healthCheckRating: z.number().optional(),
  discharge: z
    .object({
      date: z.string(),
      criteria: z.string(),
    })
    .optional(),
  employerName: z.string().optional(),
  sickLeave: z
    .object({
      startDate: z.string(),
      endDate: z.string(),
    })
    .optional(),
});
