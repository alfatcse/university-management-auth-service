import supertest from 'supertest';
import app from '../../app';

export const CreateDepartment = async (payload: string | object | undefined) => {
  try {
    const response = await supertest(app)
      .post('/api/v1/academic-departments/create-department')
      .send(payload);
    return response;
  } catch (error) {
    throw new Error(`Failed to create Semester: ${error}`);
  }
};
export const getAllDepartments = async () => {
  try {
    const response = await supertest(app).get('/api/v1/academic-departments/');
    return response;
  } catch (error) {
    throw new Error(`Failed to get all Semesters: ${error}`);
  }
};
export const getSingleDepartment = async (id: string) => {
  try {
    const response = await supertest(app).get(`/api/v1/academic-departments/${id}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to get a single Semester: ${error}`);
  }
};
export const deleteDepartment = async (id: string) => {
  try {
    const response = await supertest(app).delete(`/api/v1/academic-departments/${id}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to get a single Semester: ${error}`);
  }
};
export const updateDepartment = async (payload: {
  id: string;
  updateValues: string | object | undefined;
}) => {
  try {
    const response = await supertest(app)
      .patch(`/api/v1/academic-departments/${payload.id}`)
      .send(payload.updateValues);
    return response;
  } catch (error) {
    throw new Error(`Failed to get a single Semester: ${error}`);
  }
};
