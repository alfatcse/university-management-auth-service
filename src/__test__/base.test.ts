import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
  createFacultyTest,
  deleteByIdFromDBTest,
  getAllFacultiesTest,
  getSingleFacultyTest
} from './academicFacultyAPI/academicFaculty';
import {
  createAdminTest,
  deleteAdminTest,
  getAllAdminTest,
  getSingleAdminTest
} from './AdminAPI/admin';
import { admin, faculty } from './dummyData';
import { loginUser } from './AuthAPI/login';
import config from '../config';
describe('BaseAPI', () => {
  beforeAll(async () => {
    const mongoDBMemoryServer = await MongoMemoryReplSet.create({ replSet: { count: 4 } });
    const uri = mongoDBMemoryServer.getUri();
    await mongoose.connect(uri);
  });
  let Admin_Id: string = '';
  const pagination = { page: 1, limit: 2 };
  let faculty_id: string = '';
  describe('AdminAPI', () => {
    it('It should create a admin', async () => {
      const response = await createAdminTest(admin);
      Admin_Id = response.body.data.id;
      expect(response.statusCode).toBe(200);
      expect(response.body.data.admin.email).toBe(admin.admin.email);
    });
    it('It should get all admins', async () => {
      const response = await getAllAdminTest(pagination);
      expect(response.statusCode).toBe(200);
      expect(response.body.data[0].email).toBe(admin.admin.email);
    });
    it('It should get single admin', async () => {
      const response = await getSingleAdminTest(Admin_Id);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.email).toBe(admin.admin.email);
    });
  });
  describe('Auth API', () => {
    it('It Should log in a user', async () => {
      const response = await loginUser({
        id: Admin_Id,
        password: config.default_admin_pass as string
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });
  });
  describe('FacultyAPI', () => {
    it('It should create a Faculty', async () => {
      const response = await createFacultyTest(faculty);
      faculty_id = response.body.data._id;
      expect(response.statusCode).toBe(200);
      expect(response.body.data.title).toBe(faculty.title);
      expect(response.body.data.syncId).toBe(faculty.syncId);
    });
    it('It should get all Faculty', async () => {
      const response = await getAllFacultiesTest(pagination);
      expect(response.statusCode).toBe(200);
    });
    it('It should get a Single Faculty', async () => {
      const response = await getSingleFacultyTest(faculty_id);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.title).toBe(faculty.title);
      expect(response.body.data.syncId).toBe(faculty.syncId);
    });
  });
  describe('Delete All Dummy data', () => {
    it('Delete an admin', async () => {
      const response = await deleteAdminTest(Admin_Id);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.email).toBe(admin.admin.email);
    });
    it('It should delete a Single Faculty', async () => {
      const response = await deleteByIdFromDBTest(faculty_id);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.title).toBe(faculty.title);
      expect(response.body.data.syncId).toBe(faculty.syncId);
    });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
});
