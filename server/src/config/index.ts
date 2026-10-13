/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * Third-Party Module
 */
import dotenv from "dotenv";
import path from "path";

/**
 * Load Environment Variables
 */
dotenv.config({ path: path.join(process.cwd(), ".env") });

/**
 * Export Environment Variables
 */
export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  log_level: process.env.LOG_LEVEL || "info",
  database_url: process.env.DATABASE_URL,
  bak_url: process.env.APP_URL,
  frontend_url: process.env.FRONTEND_URL,

  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS!,

  jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN!,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN!,

  super_admin_name: process.env.SUPER_ADMIN_NAME!,
  super_admin_email: process.env.SUPER_ADMIN_EMAIL!,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD!,

  tester_admin_name: process.env.TESTER_ADMIN_NAME!,
  tester_admin_email: process.env.TESTER_ADMIN_EMAIL!,
  tester_admin_password: process.env.TESTER_ADMIN_PASSWORD!,

  tester_doctor_name: process.env.TESTER_DOCTOR_NAME!,
  tester_doctor_email: process.env.TESTER_DOCTOR_EMAIL!,
  tester_doctor_password: process.env.TESTER_DOCTOR_PASSWORD!,

  redis_user: process.env.REDIS_USER!,
  redis_password: process.env.REDIS_PASSWORD!,
  redis_host: process.env.REDIS_HOST!,
  redis_port: process.env.REDIS_PORT!,

  email_user: (process.env.EMAIL_USER || process.env.SMTP_USER)!,
  email_pass: (process.env.EMAIL_PASS || process.env.SMTP_PASS)!,
  email_sender: (process.env.EMAIL_SENDER || process.env.SMTP_USER)!,

  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET!,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY!,
};
