import { Request, RequestHandler, Response } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createdUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body;
    const result = await UserService.createUser(userData);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created Successfully!',
      data: result,
    });
  }
);

export const UserController = { createdUser };
