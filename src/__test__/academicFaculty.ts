import supertest from 'supertest';
import app from '../app';

export const createFacultyTest = async () => {
  try {
    const response = await supertest(app).post(`/api/v1/academic-faculties/create-faculty`).send({
      title: 'Computer Science',
      syncId: '4555'
    });
    console.log(response.body);
    return response;
  } catch (error) {
    throw new Error(`Failed to create faculty: ${error}`);
  }
};
