import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });
export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  default_student_pass: process.env.DEFAULT_STUDENT_PASSWORD,
  default_faculty_pass: process.env.DEFAULT_FACULTY_PASSWORD,
  default_admin_pass: process.env.DEFAULT_ADMIN_PASSWORD,
  env: process.env.NODE_ENV,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_SECRET_REFRECH,
    expires_in: process.env.JWT_SECRET_EXPIRES,
    refresh_expires_in: process.env.JWT_SECRET_REFRECH_EXPIRES,
  },
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
};
