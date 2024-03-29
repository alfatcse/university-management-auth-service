import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelpers } from '../../helpers/jwt.helper';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Not Authorized');
      }
      let verifiedUser = null;
      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
      req.user = verifiedUser;
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        console.log('Auth');
        throw new ApiError(httpStatus.FORBIDDEN, 'Not Authorized');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
export default auth;
