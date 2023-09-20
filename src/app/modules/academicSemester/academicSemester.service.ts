import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import {
  academicSemesterSearchableFields,
  academicSemesterTitleCodeMapper,
} from './academicSemester.constant';
import {
  IAcademicSemester,
  IAcademicSemesterCreatedEvent,
} from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';
import { IPaginationOptions } from '../../../interfaces/pagination';
import {
  IAcademicSemesterFilters,
  IGenericResponse,
} from '../../../interfaces/common';
import { paginationHelper } from '../../../helpers/paginationhelper';
import { SortOrder } from 'mongoose';
const createSemester = async (
  payload: IAcademicSemester
): Promise<IAcademicSemester> => {
  if (academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Semester Code');
  }
  const result = await AcademicSemester.create(payload);
  return result;
};
const getAllsemesters = async (
  filters: IAcademicSemesterFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IAcademicSemester[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: academicSemesterSearchableFields.map(field => ({
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
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};
  const result = await AcademicSemester.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
  const total = await AcademicSemester.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getSingleSemester = async (
  id: string
): Promise<IAcademicSemester | null> => {
  const result = await AcademicSemester.findById(id);
  return result;
};
const updateSemester = async (
  id: string,
  payload: Partial<IAcademicSemester>
): Promise<IAcademicSemester | null> => {
  if (
    payload.title &&
    payload.code &&
    academicSemesterTitleCodeMapper[payload.title] !== payload.code
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Semester Code');
  }
  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};
const deteleSemester = async (
  id: string
): Promise<IAcademicSemester | null> => {
  const result = await AcademicSemester.findByIdAndDelete(id);
  return result;
};
const createSemesterFromEvent = async (
  e: IAcademicSemesterCreatedEvent
): Promise<void> => {
  await AcademicSemester.create({
    title: e.title,
    year: e.year,
    code: e.code,
    startMonth: e.startMonth,
    endMonth: e.endMonth,
    syncId: e.id,
  });
};
const updateOneIntoDBFromEvent = async (
  e: IAcademicSemesterCreatedEvent
): Promise<void> => {
  await AcademicSemester.findOneAndUpdate(
    { syncId: e.id },
    {
      $set: {
        title: e.title,
        year: e.year,
        code: e.code,
        startMonth: e.startMonth,
        endMonth: e.endMonth,
      },
    }
  );
};
const deleteOneFromDBFromEvent = async (syncId: string): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log('del');
  await AcademicSemester.findOneAndDelete({ syncId });
};
export const AcademicSemesterService = {
  createSemester,
  getAllsemesters,
  getSingleSemester,
  updateSemester,
  deteleSemester,
  createSemesterFromEvent,
  updateOneIntoDBFromEvent,
  deleteOneFromDBFromEvent,
};
