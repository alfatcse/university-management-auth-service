import supertest from 'supertest';
import app from '../../app';

export const createFaculty = async (faculty: any) => {
  try {
    const response = await supertest(app)
      .post(`/api/v1/users/create-faculty`)
      .send(faculty.faculty_data)
      .set('authorization', `${faculty.AdminAccessToken}`);
    console.log(response.body);
    return response;
  } catch (error) {
    throw new Error(`Failed to create faculty: ${error}`);
  }
};
