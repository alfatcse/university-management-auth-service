import supertest from 'supertest';
import app from '../../app';
export const createAdminTest = async (admin: any) => {
  try {
    const response = await supertest(app).post(`/api/v1/users/create-admin`).send(admin);
    return response;
  } catch (error) {
    throw new Error(`Failed to create admin: ${error}`);
  }
};
export const getAllAdminTest = async (pagination: { page: number; limit: number }) => {
  try {
    const response = await supertest(app).get(
      `/api/v1/admins?page=${pagination.page}&limit=${pagination.page}`
    );
    return response;
  } catch (error) {
    throw new Error(`Failed to get All admins: ${error}`);
  }
};
export const getSingleAdminTest = async (id: string) => {
  try {
    const response = await supertest(app).get(`/api/v1/admins/${id}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to get Single admin: ${error}`);
  }
};
