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
