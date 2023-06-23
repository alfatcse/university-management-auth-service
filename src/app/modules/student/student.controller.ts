import { Request, RequestHandler, Response } from 'express';
import { StudentService } from './student.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constant/pagination';
import { IStudent } from './student.interface';
import { studentFilterableFields } from './student.constant';
const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, studentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await StudentService.getAllStudents(
    filters,
    paginationOptions
  );
  sendResponse<IStudent[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Students retrieved Successfully!',
    data: result.data,
    meta: result.meta,
  });
});
const getSingleStudent = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await StudentService.getSingleStudent(id);
  sendResponse<IStudent>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student retrieved Successfully!',
    data: result,
  });
});
const updateStudent = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await StudentService.updateStudent(id, updatedData);
  sendResponse<IStudent>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Updated Successfully!',
    data: result,
  });
});
const deleteStudent = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await StudentService.deteleStudent(id);
  sendResponse<IStudent>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Deleted Successfully!',
    data: result,
  });
});
const createStudent: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { student, ...userData } = req.body;
    const result = await StudentService.createStudent(student, userData);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created Successfully!',
      data: result,
    });
  }
);
export const StudentController = {
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
  createStudent,
};
