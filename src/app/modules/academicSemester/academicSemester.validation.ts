import { z } from 'zod';
import { academicSemesterMonths } from './academicSemester.constant';
const createAcademicSemesterZodSchema = z.object({
  body: z.object({
    title: z.enum(['Autumn', 'Summer', 'Fall'], {
      required_error: 'Title is Required',
    }),
    year: z.number({
      required_error: 'Year is Required',
    }),
    code: z.enum(['01', '02', '03'], {
      required_error: 'Code is Required',
    }),
    startMonth: z.enum([...academicSemesterMonths] as [string, ...string[]], {
      required_error: 'Start Month is Required',
    }),
    endMonth: z.enum([...academicSemesterMonths] as [string, ...string[]], {
      required_error: 'Start Month is Required',
    }),
  }),
});
export const AcademicSemesterValidation = {
  createAcademicSemesterZodSchema,
};
// await createUserZodSchema.parseAsync(req)
