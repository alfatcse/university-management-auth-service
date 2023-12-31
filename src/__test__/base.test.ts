import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createFacultyTest } from './academicFaculty';
describe('Faculty', () => {
  beforeAll(async () => {
    const mongoDBMemoryServer = await MongoMemoryServer.create();
    const uri = mongoDBMemoryServer.getUri();
    await mongoose.connect(uri);
  });
  describe('Create Faculty', () => {
    it('It should create a Faculty', async () => {
      const response = await createFacultyTest();
      expect(response.statusCode).toBe(200);
    });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
});
