import { NextFunction, Request, Response } from 'express';
import { AcademicSemesterService } from './academicSemester.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
const createSemester = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...academicSemesterData } = req.body;
    const result = await AcademicSemesterService.createSemester(
      academicSemesterData
    );
    next();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created Successfully!',
      data: result,
    });
    // res.status(200).json({
    //   success: true,
    //   message: 'Academic Semester created Successfully!',
    //   data: result,
    // });
  }
);

// async (req, res, next) => {
//   try {
//     const { ...academicSemesterData } = req.body;
//     const result = await AcademicSemesterService.createSemester(
//       academicSemesterData
//     );
//     res.status(200).json({
//       success: true,
//       message: 'Academic Semester created Successfully!',
//       data: result,
//     });
//   } catch (err) {
//     next(err);
//   }
// };
export const AcademicSemesterController = { createSemester };
