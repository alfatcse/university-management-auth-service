import supertest from 'supertest';
import app from '../../app';

export const createFaculty = async (faculty: any) => {
  try {
    const response = await supertest(app)
      .post(`/api/v1/users/create-faculty`)
      .send(faculty.faculty_data)
      .set('authorization', `${faculty.AdminAccessToken}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to create faculty: ${error}`);
  }
};
export const getAllFaculties = async (accessToken: string) => {
  try {
    const response = await supertest(app)
      .get(`/api/v1/faculty`)
      .set('authorization', `${accessToken}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to create faculty: ${error}`);
  }
};
