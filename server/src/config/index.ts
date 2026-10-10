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
    log_level: process.env.LOG_LEVEL || "info",
    database_url: process.env.DATABASE_URL,
    bak_url: process.env.APP_URL,
    frontend_url: process.env.FRONTEND_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN!,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN!
}