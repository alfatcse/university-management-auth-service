import supertest from 'supertest';
import app from '../../app';
export const createSemester = async (payload: string | object | undefined) => {
  try {
    const response = await supertest(app)
      .post(`/api/v1/academic-semesters/create-semester`)
      .send(payload);
    return response;
  } catch (error) {
    throw new Error(`Failed to create Semester: ${error}`);
  }
};
export const getAllsemesters = async () => {
  try {
    const response = await supertest(app).get(`/api/v1/academic-semesters/`);
    return response;
  } catch (error) {
    throw new Error(`Failed to get Semester: ${error}`);
  }
};
export const getSingleSemester = async (id: string) => {
  try {
    const response = await supertest(app).get(`/api/v1/academic-semesters/${id}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to get Semester: ${error}`);
  }
};
export const searchSingleSemester = async (payload: { keyword: string; value: string }) => {
  try {
    const response = await supertest(app).get(
      `/api/v1/academic-semesters?${payload.keyword}=${payload.value}`
    );
    return response;
  } catch (error) {
    throw new Error(`Failed to get Semester: ${error}`);
  }
};
export const updateSingleSemester = async (payload: {
  id: string;
  updateValues: string | object | undefined;
}) => {
  try {
    const response = await supertest(app)
      .patch(`/api/v1/academic-semesters/${payload.id}`)
      .send(payload.updateValues);
    return response;
  } catch (error) {
    throw new Error(`Failed to update Semester Info: ${error}`);
  }
};
