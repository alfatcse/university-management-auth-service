import supertest = require('supertest');
import app from '../app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
describe('Faculty', () => {
  beforeAll(async () => {
    const mongoDBMemoryServer = await MongoMemoryServer.create();
    const uri = mongoDBMemoryServer.getUri();
    await mongoose.connect(uri);
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  describe('Create Faculty', () => {
    it('It should create a Faculty', async () => {
      const response = await supertest(app).post(`/api/v1/academic-faculties/create-faculty`).send({
        title: 'Computer Science',
        syncId: '4555'
      });
      expect(response.statusCode).toBe(200);
    });
  });
});
