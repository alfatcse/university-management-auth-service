import express from 'express';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from '../faculty/faculty.controller';
import { facultyValidation } from '../faculty/faculty.validation';
import { AdminValidation } from '../admin/admin.validation';
import { AdminController } from '../admin/admin.controller';
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
router.post(
  '/create-admin',
  validateRequest(AdminValidation.updateAdminZodSchema),
  AdminController.createAdmin
);
export const UserRoute = router;
