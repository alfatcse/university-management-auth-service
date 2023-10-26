import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';
const userSchema = new Schema<IUser, Record<string, never>>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    passwordChangeAt: {
      type: Date,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.isUserExist = async function (
  id: string
): Promise<Partial<IUser> | null> {
  const a = await User.findOne(
    { id },
    { id: 1, password: 1, role: 1, needsPasswordChange: 1 }
  );
  return a;
};
userSchema.methods.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line no-console
  console.log(this);
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bycrypt_salt_rounds)
  );
  next();
});
export const User = model<IUser, UserModel>('User', userSchema);
