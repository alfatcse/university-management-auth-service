import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { AuthService } from './auth.service';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import config from '../../../config';
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUser(loginData);
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true
  };
  const { refreshToken } = result;
  res.cookie('refreshToken', refreshToken, cookieOptions);
  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User login Successfully',
    data: result
  });
});
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { ...passwordData } = req.body;
  const user = req.user;
  await AuthService.changePassword(user, passwordData);
  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Password Change Successfully'
  });
});
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);
  // const cookieOptions = {
  //   secure: config.env === 'production',
  //   httpOnly: true,
  // };
  // res.cookie('refreshToken', refreshToken, cookieOptions);
  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User login Successfully',
    data: result
  });
});
const forgotPass = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  await AuthService.forgotPass(req.body);
  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Check Your Email'
  });
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.body.token || '';
  await AuthService.resetPassword(req.body.values, token);
  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password Changed'
  });
});
export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPass,
  resetPassword
};
