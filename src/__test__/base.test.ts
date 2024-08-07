import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
  createFacultyTest,
  deleteFaculty,
  getAllFacultiesTest,
  getSingleFacultyTest
} from './academicFacultyAPI/academicFaculty';
import {
  createAdminTest,
  deleteAdminTest,
  getAllAdminTest,
  getSingleAdminTest
} from './AdminAPI/admin';
import { admin, department, faculty, faculty_data, semesterData, student_data } from './dummyData';
import { changePassword, forgotPass, loginUser, refreshToken } from './AuthAPI/auth';
import config from '../config';
import {
  createSemester,
  getAllsemesters,
  getSingleSemester,
  searchSingleSemester,
  updateSingleSemester
} from './SemesterAPI/semester';
import {
  CreateDepartment,
  deleteDepartment,
  getAllDepartments,
  getSingleDepartment,
  updateDepartment
} from './AcademicDepartmentAPI/department';
import { createFaculty, getAllFaculties } from './FacultyAPI/Faculty';
import { RedisClient } from '../shared/redis';
import subscribeToEvents from '../events';
import { CreateStudent, DeleteStudent, GetAllStudent, getSingleStudent } from './StudentAPI/student';
describe('BaseAPI', () => {
  beforeAll(async () => {
    const mongoDBMemoryServer = await MongoMemoryReplSet.create({ replSet: { count: 4 } });
    const uri = mongoDBMemoryServer.getUri();
    await mongoose.connect(uri);
    await RedisClient.connect().then(() => {
      subscribeToEvents();
    });
  });
  let Admin_Id: string = '';
  const pagination = { page: 1, limit: 2 };
  let faculty_id: string = '';
  let AdminAccessToken = '';
  let AdminRefreshToken = '';
  let semesterId = '';
  let departmentId = '';
  let student_id = '';
  describe('Admin API', () => {
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
      const setCookieHeader = response.headers['set-cookie'];
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
      expect(response.statusCode).toBe(200);
      expect(response.message).toBe('User Password Change Successfully');
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
      expect(response.body.message).toBe('New Refresh Token Generated Successfully');
      expect(response.body.data).toHaveProperty('accessToken');
    });
  });
  describe('Academic Faculty API', () => {
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
  describe('Semester API', () => {
    it('It should create a semester data', async () => {
      const response = await createSemester(semesterData);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Semester created Successfully!');
      expect(response.body.data.year + '').toBe(semesterData.year);
    });
    it('It should get all semester data', async () => {
      const response = await getAllsemesters();
      semesterId = response.body.data[0]._id;
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Semester retrieved Successfully!');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.limit).toBe(10);
    });
    it('It should get a single semester data', async () => {
      const response = await getSingleSemester(semesterId);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Semester retrieved Successfully!');
      expect(response.body.data.year + '').toBe(semesterData.year);
    });
    it('It should search a semester data by a keyword', async () => {
      const searchTerm = {
        keyword: 'year',
        value: semesterData.year
      };
      const response = await searchSingleSemester(searchTerm);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Semester retrieved Successfully!');
      expect(response.body.data[0].year + '').toBe(semesterData.year);
    });
    it('It should update a semester data ', async () => {
      const updateTerm = {
        id: semesterId,
        updateValues: {
          year: '2027'
        }
      };
      const response = await updateSingleSemester(updateTerm);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Semester Updated Successfully!');
      expect(response.body.data.year + '').toBe(updateTerm.updateValues.year);
    });
  });
  describe('Department API', () => {
    it('It Should Create a Department data', async () => {
      department.academicFaculty = faculty_id;
      const response = await CreateDepartment(department);
      departmentId = response.body.data.id;
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Academic Department created successfully');
      expect(response.body.data.title).toBe(department.title);
      expect(response.body.data.academicFaculty.title).toBe(faculty.title);
    });
    it('It should get all departments', async () => {
      const response = await getAllDepartments();
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Academic departments fetched successfully');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.limit).toBe(10);
    });
    it('It should get a single department', async () => {
      const response = await getSingleDepartment(departmentId);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Single Academic Department data fetched successfully!');
      expect(response.body.data.title).toBe(department.title);
    });
    it('It should update a single department', async () => {
      const updateTerm = {
        id: departmentId,
        updateValues: {
          title: 'Software Development'
        }
      };
      const response = await updateDepartment(updateTerm);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Academic Department updated successfully');
      expect(response.body.data.title).toBe(updateTerm.updateValues.title);
    });
  });
  describe('Faculty API', () => {
    it('It should create a faculty', async () => {
      const faculty_data_with_accessToken = {
        faculty_data,
        AdminAccessToken
      };
      faculty_data_with_accessToken.faculty_data.faculty.academicDepartment = departmentId;
      faculty_data_with_accessToken.faculty_data.faculty.academicFaculty = faculty_id;
      const response = await createFaculty(faculty_data_with_accessToken);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('User created Successfully!');
      expect(response.body.data.role).toBe('faculty');
    });
    it('Get all faculties data', async () => {
      const response = await getAllFaculties(AdminAccessToken);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('All Faculty retrieved Successfully!');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
  describe('Student API', () => {
    it('It should create a student', async () => {
      student_data.student.academicFaculty=faculty_id;
      student_data.student.academicDepartment=departmentId;
      student_data.student.academicSemester=semesterId;
      const response = await CreateStudent(student_data);
      expect(response.statusCode).toBe(200);
      student_id = response.body.data.id;
    });
    it('It should get a All Students', async () => {
     const response = await GetAllStudent();
     expect(response.statusCode).toBe(200);
    });
    it('It should get a single student', async () => {
      const response = await getSingleStudent(student_id);
      expect(response.statusCode).toBe(200);
    })
  });
  describe('Delete All Dummy data', () => {
    it('Delete an admin', async () => {
      const response = await deleteAdminTest(Admin_Id);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.email).toBe(admin.admin.email);
    });
    it('It should delete a Single Faculty', async () => {
      const response = await deleteFaculty(faculty_id);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.title).toBe(faculty.title);
      expect(response.body.data.syncId).toBe(faculty.syncId);
    });
    it('It should delete a single Department', async () => {
      const response = await deleteDepartment(departmentId);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Academic Department deleted successfully');
      expect(response.body.data.syncId).toBe(department.syncId);
    });
    it('It should delete a single Student', async () => {
      const response = await DeleteStudent(student_id);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Student Deleted Successfully!');
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await RedisClient.disconnect().then(() => {
      console.log('Redis disconnected Successfully!');
    });
  });
});
