import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
  createFacultyTest,
  deleteByIdFromDBTest,
  getAllFacultiesTest,
  getSingleFacultyTest
} from './academicFacultyAPI/academicFaculty';
import { createAdminTest, getAllAdminTest, getSingleAdminTest } from './AdminAPI/admin';
describe('BaseAPI', () => {
  beforeAll(async () => {
    const mongoDBMemoryServer = await MongoMemoryReplSet.create({ replSet: { count: 4 } });
    const uri = mongoDBMemoryServer.getUri();
    await mongoose.connect(uri);
  });
  describe('AdminAPI', () => {
    const admin = {
      admin: {
        name: {
          firstName: 'Fatima',
          lastName: 'Nahar',
          middleName: 'Ibnath'
        },
        dateOfBirth: '14-05-1998',
        gender: 'male',
        bloodGroup: 'O+',
        email: 'fatima@gmail.com',
        contactNo: '018005096',
        emergencyContactNo: '0183300089',
        presentAddress: 'ctg',
        permanentAddress: 'ctg',
        designation: 'HR executive',
        managementDepartment: '650eaa8d7d5a4252f2050ac5'
      }
    };
    let id: string = '';
    const pagination = { page: 1, limit: 2 };
    it('It should create a admin', async () => {
      const response = await createAdminTest(admin);
      id = response.body.data.id;
      expect(response.statusCode).toBe(200);
      expect(response.body.data.admin.email).toBe(admin.admin.email);
    });
    it('It should get all admins', async () => {
      const response = await getAllAdminTest(pagination);
      expect(response.statusCode).toBe(200);
      expect(response.body.data[0].email).toBe(admin.admin.email);
    });
    it('It should get single admin', async () => {
      const response = await getSingleAdminTest(id);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.email).toBe(admin.admin.email);
    });
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
      const response = await getAllFacultiesTest(pagination);
      expect(response.statusCode).toBe(200);
    });
    it('It should get a Single Faculty', async () => {
      const response = await getSingleFacultyTest(id);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.title).toBe(faculty.title);
      expect(response.body.data.syncId).toBe(faculty.syncId);
    });
    it('It should delete a Single Faculty', async () => {
      const response = await deleteByIdFromDBTest(id);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.title).toBe(faculty.title);
      expect(response.body.data.syncId).toBe(faculty.syncId);
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
