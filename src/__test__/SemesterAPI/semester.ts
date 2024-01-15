import supertest from 'supertest';
import app from '../../app';
export const createSemester = async (payload: string | object | undefined) => {
  try {
    const response = await supertest(app)
      .post(`/api/v1/academic-semesters/create-semester`)
      .send(payload);
    return response;
  } catch (error) {
    throw new Error(`Failed to create admin: ${error}`);
  }
};
