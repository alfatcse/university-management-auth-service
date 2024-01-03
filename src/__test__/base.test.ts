import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
  createFacultyTest,
  deleteByIdFromDB,
  getAllFaculties,
  getSingleFaculty
} from './academicFacultyAPI/academicFaculty';
describe('Base', () => {
  beforeAll(async () => {
    const mongoDBMemoryServer = await MongoMemoryServer.create();
    const uri = mongoDBMemoryServer.getUri();
    await mongoose.connect(uri);
  });
  describe('FacultyAPI', () => {
    const faculty = {
      title: 'Computer Science',
      syncId: '4555'
    };
    const pagination = { page: 1, limit: 2 };
    let id: string = '';
    it('It should create a Faculty', async () => {
      const response = await createFacultyTest(faculty);
      id = response.body.data._id;
      expect(response.statusCode).toBe(200);
      expect(response.body.data.title).toBe(faculty.title);
      expect(response.body.data.syncId).toBe(faculty.syncId);
    });
    it('It should get all Faculty', async () => {
      const response = await getAllFaculties(pagination);
      expect(response.statusCode).toBe(200);
    });
    it('It should get a Single Faculty', async () => {
      const response = await getSingleFaculty(id);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.title).toBe(faculty.title);
      expect(response.body.data.syncId).toBe(faculty.syncId);
    });
    it('It should delete a Single Faculty', async () => {
      console.log(id);
      const response = await deleteByIdFromDB(id);
      console.log(response.body);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.title).toBe(faculty.title);
      expect(response.body.data.syncId).toBe(faculty.syncId);
    });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
});
