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
import { changePassword, forgotPass, loginUser, refreshToken } from './AuthAPI/auth';
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
  let AdminAccessToken = '';
  let AdminRefreshToken = '';
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
      AdminAccessToken = response.body.data.accessToken;
      AdminRefreshToken = response.body.data.refreshToken;
      const setCookieHeader = response.headers['authorization'];
      console.log('setCookieHeader', setCookieHeader);
      expect(setCookieHeader).toBeDefined();
      const refreshTokenCookie = setCookieHeader[0].startsWith('refreshToken=');
      expect(refreshTokenCookie).toBeDefined();
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });
    it('It Should send a reset link to email', async () => {
      const response = await forgotPass({ id: Admin_Id });
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Check Your Email');
    });
    it('It Should Change The Current Password', async () => {
      const payload = {
        oldPassword: config.default_admin_pass as string,
        newPassword: '123456',
        refreshToken: AdminRefreshToken
      };
      const response = await changePassword(payload);
    });
    it('It Should generate a refresh token', async () => {
      const response = await refreshToken({
        id: Admin_Id,
        password: config.default_admin_pass as string,
        refreshToken: AdminRefreshToken
      });
      const setCookieHeader = response.headers['set-cookie'];
      expect(setCookieHeader).toBeDefined();
      const refreshTokenCookie = setCookieHeader[0].startsWith('refreshToken=');
      expect(refreshTokenCookie).toBeDefined();
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('User login Successfully');
      expect(response.body.data).toHaveProperty('accessToken');
    });
  });
  describe('FacultyAPI', () => {
    it('It should create a Faculty', async () => {
      const faculty_data = {
        faculty,
        AdminAccessToken
      };
      const response = await createFacultyTest(faculty_data);
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
