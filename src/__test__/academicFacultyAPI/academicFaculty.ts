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
    const response = await supertest(app).get(`/api/v1/academic-faculties/${id}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to get all faculties: ${error}`);
  }
};
export const deleteByIdFromDB = async (id: string) => {
  try {
    console.log(id);
    const response = await supertest(app).delete(`/api/v1/academic-faculties/${id}`);
    return response;
  } catch (error) {
    throw new Error(`Successfully faculty deleted: ${error}`);
  }
};
