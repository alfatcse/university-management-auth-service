import mongoose from 'mongoose';
import config from '../../../config/index';
import ApiError from '../../../errors/ApiError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { IStudent } from '../student/student.interface';
import { IUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import { Student } from '../student/student.model';
import httpStatus from 'http-status';
const createStudent = async (
  student: IStudent,
  user: IUser
): Promise<IUser | null> => {
  // const id = await generateFacultyId();
  // user.id = id;
  if (!user.password) {
    user.password = config.default_student_pass as string;
  }
  user.role = 'student';
  const academicSemester = await AcademicSemester.findById(
    student.academicSemester
  );
  //generate student id
  const session = await mongoose.startSession();
  let newUseAllData = null;
  try {
    session.startTransaction();
    const id = await generateStudentId(academicSemester);
    user.id = id;
    student.id = id;
    const newStudent = await Student.create([student], { session });
    if (!newStudent.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Student');
    }
    user.student = newStudent[0]._id;
    const newUser = await User.create([user], { session });
    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create User');
    }
    newUseAllData = newUser[0];
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUseAllData) {
    newUseAllData = await User.findOne({ id: newUseAllData.id }).populate({
      path: 'student',
      populate: [
        {
          path: 'academicSemester',
        },
        {
          path: 'academicDepartment',
        },
        {
          path: 'academicFaculty',
        },
      ],
    });
  }
  return newUseAllData;
};
export const UserService = {
  createStudent,
};
