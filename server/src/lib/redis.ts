/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * Third-Party Module
 */
import { createClient } from "redis";

/**
 * Internal Module
 */
import config from "@/config";

/**
 * Create Redis Client
 */
export const redisClient = createClient({
    username: config.redis_user,
    password: config.redis_password,
    socket: {
        host: config.redis_host,
        port: Number(config.redis_port)
    }
});
