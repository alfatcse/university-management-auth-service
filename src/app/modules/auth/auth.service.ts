/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse
} from './auth.interface';
import config from '../../../config';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { jwtHelpers } from '../../../helpers/jwt.helper';
import bcrypt from 'bcrypt';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { Admin } from '../admin/admin.model';
import { Faculty } from '../faculty/faculty.model';
import { Student } from '../student/student.model';
import { sendEmail } from './sendResetMail';
const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;
  const user = new User();
  const isUserExist = await user.isUserExist(id);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not exist');
  }
  if (isUserExist.password && !(await user.isPasswordMatched(password, isUserExist?.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password Does incorrect');
  }
  const accessToken = jwtHelpers.createToken(
    { userId: isUserExist?.id, role: isUserExist?.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    { userId: isUserExist?.id, role: isUserExist?.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );
  const { needsPasswordChange } = isUserExist;
  return { accessToken, refreshToken, needsPasswordChange };
};
const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(token, config.jwt.refresh_secret as Secret);
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'invalid refreshToken');
  }
  const { userId } = verifiedToken;
  const user = new User();
  const isUserExist = await user.isUserExist(userId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not exist');
  }
  const newAccessToken = jwtHelpers.createToken(
    { id: isUserExist?.id, role: isUserExist?.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken
  };
};
const changePassword = async (
  userData: JwtPayload | null,
  payload: IChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = payload;
  const user = new User();
  //checking is user exist
  const isUserExist = await user.isUserExist(userData?.userId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not exist');
  }
  //checking old password
  if (isUserExist.password && !(await user.isPasswordMatched(oldPassword, isUserExist?.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
  }
  //hash password before saving
  const newHasheddPassword = await bcrypt.hash(newPassword, Number(config.bycrypt_salt_rounds));
  const updatedData = {
    password: newHasheddPassword,
    needsPasswordChange: false,
    passwordChangeAt: new Date()
  };
  const query = { id: userData?.userId };
  await User.findOneAndUpdate(query, updatedData);
};
const forgotPass = async (payload: any) => {
  const user = await User.findOne({ id: payload.id }, { id: 1, role: 1 });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not exists!');
  }
  let profile = null;
  if (user.role === ENUM_USER_ROLE.ADMIN || user.role === ENUM_USER_ROLE.SUPER_ADMIN) {
    profile = await Admin.findOne({ id: user.id });
  } else if (user.role === ENUM_USER_ROLE.FACULTY) {
    profile = await Faculty.findOne({ id: user.id });
  } else if (user.role === ENUM_USER_ROLE.STUDENT) {
    profile = await Student.findOne({ id: user.id });
  }
  if (!profile) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Profile not Found!');
  }
  if (!profile.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email not Found!');
  }
  const passwordResetToken = jwtHelpers.createPasswordResetToken(
    { id: user.id },
    config.jwt.secret as string,
    '50m'
  );
  const resetLink: string =
    config.resetLink + `/reset-password?id=${user.id}&token=${passwordResetToken}`;
  await sendEmail(
    profile.email,
    `<div>
  <p>Hi,${profile.name.firstName}</p>
  <p>Your password reset Link: <a href=${resetLink}>Click Here</a></p>
  <p>Thank you</p>
  </div>`
  );
  return {
    message: 'Check your link!'
  };
};
const resetPassword = async (
  payload: {
    id: string;
    newPassword: string;
  },
  token: string
) => {
  const user = await User.findOne({ id: payload.id }, { id: 1 });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Found!');
  }
  const isVerified = jwtHelpers.verifyToken(token, config.jwt.secret as string);
  if (isVerified) {
    const password = await bcrypt.hash(
      payload.newPassword,
      Number(config.bycrypt_salt_rounds) || 12
    );
    await User.updateOne({ id: payload.id }, { password });
  }
};
export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPass,
  resetPassword
};
