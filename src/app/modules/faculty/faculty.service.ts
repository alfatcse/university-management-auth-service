import { IUser } from '../user/user.interface';
import { IFaculty } from './faculty.interface';
import config from '../../../config/index';
import mongoose from 'mongoose';
import { generateFacultyId } from '../user/user.utils';
import { Faculty } from './faculty.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
const createFaculty = async (
  faculty: IFaculty,
  user: IUser
): Promise<IUser | null> => {
  if (!user.password) {
    user.password = config.default_student_pass as string;
  }
  user.role = 'faculty';
  // eslint-disable-next-line no-console
  console.log(user, 'ffff', faculty);
  const session = await mongoose.startSession();
  let newUseAllData = null;
  try {
    session.startTransaction();
    const id = await generateFacultyId();
    user.id = id;
    faculty.id = id;
    const newFaculty = await Faculty.create([faculty], { session });
    if (!newFaculty.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create Faculty');
    }
    user.faculty = newFaculty[0]._id;
    const newUser = await User.create([user], { session });
    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create Faculty');
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
      path: 'faculty',
      populate: [
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
export const FacultyService = {
  createFaculty,
};
