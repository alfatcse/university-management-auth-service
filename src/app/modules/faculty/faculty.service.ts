import { IUser } from '../user/user.interface';
import { IFaculty, IFacultyFilter } from './faculty.interface';
import config from '../../../config/index';
import mongoose, { SortOrder } from 'mongoose';
import { generateFacultyId } from '../user/user.utils';
import { Faculty } from './faculty.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelper } from '../../../helpers/paginationhelper';
import { facultySearchableFields } from './faculty.constant';
const createFaculty = async (
  faculty: IFaculty,
  user: IUser
): Promise<IUser | null> => {
  if (!user.password) {
    user.password = config.default_student_pass as string;
  }
  user.role = 'faculty';
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
const getAllFaculty = async (
  filters: IFacultyFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IFaculty[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: facultySearchableFields.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};
  const result = await Faculty.find(whereCondition)
    .populate('academicDepartment')
    .populate('academicFaculty')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
  const total = await Faculty.count(whereCondition);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getSingleFaculty = async (id: string): Promise<IFaculty | null> => {
  const result = await Faculty.findOne({ id })
    .populate('academicDepartment')
    .populate('academicFaculty');
  return result;
};
const updateFaculty = async (
  id: string,
  payload: Partial<IFaculty>
): Promise<IFaculty | null> => {
  const isExit = await Faculty.findOne({ id });
  if (!isExit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not Found!!');
  }
  const { name, ...facultyData } = payload;
  const updatedFacultyData: Partial<IFaculty> = { ...facultyData };
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IFaculty>;
      (updatedFacultyData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  const result = await Faculty.findOneAndUpdate({ id }, updatedFacultyData, {
    new: true,
  });
  return result;
};
export const FacultyService = {
  createFaculty,
  getAllFaculty,
  getSingleFaculty,
  updateFaculty,
};
