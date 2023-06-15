import express from 'express';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from '../faculty/faculty.controller';
import { facultyValidation } from '../faculty/faculty.validation';
const router = express.Router();
router.post(
  '/create-student',
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createStudent
);
router.post(
  '/create-faculty',
  validateRequest(facultyValidation.updateFacultyZodSchema),
  FacultyController.createFaculty
);
export const UserRoute = router;
