import express from 'express';
import { UserValidation } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from '../faculty/faculty.controller';
import { AdminController } from '../admin/admin.controller';
import { StudentController } from '../student/student.controller';
const router = express.Router();
router.post(
  '/create-student',
  validateRequest(UserValidation.createStudentZodSchema),
  StudentController.createStudent
);
router.post(
  '/create-faculty',
  validateRequest(UserValidation.createFacultyZodSchema),
  FacultyController.createFaculty
);
router.post(
  '/create-admin',
  validateRequest(UserValidation.createAdminZodSchema),
  AdminController.createAdmin
);
export const UserRoute = router;
