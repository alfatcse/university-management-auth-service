import express from 'express';
import { AcademicSemesterValidation } from './academicSemester.validation';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterController } from './academicSemester.Controller';
const router = express.Router();
router.post(
  '/create-semester',
  validateRequest(AcademicSemesterValidation.createAcademicSemesterZodSchema),
  AcademicSemesterController.createSemester
);
router.get('/', AcademicSemesterController.getAllSemesters);
export const AcademicSemesterRoute = router;
