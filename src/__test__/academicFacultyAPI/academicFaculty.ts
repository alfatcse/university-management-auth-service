import supertest from 'supertest';
import app from '../../app';

export const createFacultyTest = async (faculty: { title: string; syncId: string }) => {
  try {
    const response = await supertest(app)
      .post(`/api/v1/academic-faculties/create-faculty`)
      .send(faculty);
    return response;
  } catch (error) {
    throw new Error(`Failed to create faculty: ${error}`);
  }
};
export const getAllFaculties = async (pagination: { page: number; limit: number }) => {
  try {
    const response = await supertest(app).get(
      `/api/v1/academic-faculties?page=${pagination.page}&limit=${pagination.page}`
    );
    return response;
  } catch (error) {
    throw new Error(`Failed to get all faculties: ${error}`);
  }
};
export const getSingleFaculty = async (id: string) => {
  try {
    const response = await supertest(app).get(`/api/v1/academic-faculties?id=${id}`);
    console.log(response.body);
    return response;
  } catch (error) {
    throw new Error(`Failed to get all faculties: ${error}`);
  }
};
