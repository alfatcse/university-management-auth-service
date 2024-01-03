import { Schema, model } from 'mongoose';
import { AdminModel, IAdmin } from './admin.interface';
import { bloodGroup, designation, gender } from './admin.constant';

export const AdminSchema = new Schema<IAdmin, AdminModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: {
        firstName: {
          type: String,
          required: true
        },
        lastName: {
          type: String,
          required: true
        },
        middleName: {
          type: String,
          required: false
        }
      },
      required: true
    },
    gender: {
      type: String,
      enum: gender
    },
    dateOfBirth: {
      type: String
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    contactNo: {
      type: String,
      unique: true,
      required: true
    },
    emergencyContactNo: {
      type: String,
      required: true
    },
    bloodGroup: {
      type: String,
      enum: bloodGroup
    },
    presentAddress: {
      type: String,
      required: true
    },
    permanentAddress: {
      type: String,
      required: true
    },
    designation: {
      type: String,
      enum: designation
    },
    managementDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'ManagementDepartment',
      required: true
    },
    profileImage: {
      type: String
      // required: true,
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);
export const Admin = model<IAdmin, AdminModel>('Admin', AdminSchema);
