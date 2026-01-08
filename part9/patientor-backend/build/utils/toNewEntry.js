"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewEntrySchema = void 0;
const zod_1 = require("zod");
exports.NewEntrySchema = zod_1.z.object({
    description: zod_1.z.string(),
    date: zod_1.z.string(),
    specialist: zod_1.z.string(),
    diagnosisCodes: zod_1.z.array(zod_1.z.string()).optional(),
    type: zod_1.z.enum(['Hospital', 'OccupationalHealthcare', 'HealthCheck']),
    healthCheckRating: zod_1.z.number().optional(),
    discharge: zod_1.z
        .object({
        date: zod_1.z.string(),
        criteria: zod_1.z.string(),
    })
        .optional(),
    employerName: zod_1.z.string().optional(),
    sickLeave: zod_1.z
        .object({
        startDate: zod_1.z.string(),
        endDate: zod_1.z.string(),
    })
        .optional(),
});
