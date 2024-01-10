import supertest from 'supertest';
import app from '../../app';

export const loginUser = async (user: { id: string; password: string }) => {
  try {
    const response = await supertest(app).post(`/api/v1/auth/login`).send(user);
    return response;
  } catch (error) {
    throw new Error(`Failed to create admin: ${error}`);
  }
};
export const forgotPass = async (payload: { id: string }) => {
  try {
    const response = await supertest(app).post(`/api/v1/auth/forgot-password`).send(payload);
    return response;
  } catch (error) {
    throw new Error(`Failed to resolve forgot password: ${error}`);
  }
};
export const refreshToken = async (payload: {
  id: string;
  password: string;
  refreshToken: string;
}) => {
  try {
    const craditential = {
      id: payload.id,
      password: payload.password
    };
    const response = await supertest(app)
      .post(`/api/v1/auth/refresh-token`)
      .set('Cookie', `refreshToken=${payload.refreshToken}`)
      .send(craditential);
    return response;
  } catch (error) {
    throw new Error(`Failed to create refresh token: ${error}`);
  }
};
