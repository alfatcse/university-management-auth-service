import { Model, Types } from 'mongoose';
import { IAcademicDepartment } from '../academicDepartment/academicDepartment.interfaces';
export type UserName = {
  firstName: string;
  lastName: string;
  middleName: string;
};
export type IAdmin = {
  id: string;
  name: UserName;
  gender: 'male' | 'female';
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  designation: 'HR executive' | 'Account executive';
  managementDepartment: Types.ObjectId | IAcademicDepartment;
  profileImage?: string;
};
export type IAdminFilter = {
  searchTerm?: string;
  id?: string;
  bloodGroup?: string;
  email?: string;
  contactNo?: string;
  emergencyContactNo?: string;
};
export type AdminModel = Model<IAdmin, Record<string, unknown>>;
