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
    throw new Error(`Failed to create Semester: ${error}`);
  }
};
