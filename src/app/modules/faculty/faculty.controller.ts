import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IFaculty } from './faculty.interface';
import httpStatus from 'http-status';
// eslint-disable-next-line no-unused-vars
import pick from '../../../shared/pick';
// eslint-disable-next-line no-unused-vars
import { facultyFilterableFields } from './faculty.constant';
// eslint-disable-next-line no-unused-vars
import { paginationFields } from '../../../constant/pagination';
import { FacultyService } from './faculty.service';

const getAllFaculties = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line no-console
  console.log(req.query);
  //   const filters = pick(req.query, facultyFilterableFields);
  //   const paginationOptions = pick(req.query, paginationFields);

  sendResponse<IFaculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Students retrieved Successfully!',
  });
});
const createFaculty = catchAsync(async (req: Request, res: Response) => {
  const { faculty, ...userData } = req.body;
  const result = await FacultyService.createFaculty(faculty, userData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created Successfully!',
    data: result,
  });
});
export const FacultyController = {
  getAllFaculties,
  createFaculty,
};
