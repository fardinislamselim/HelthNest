/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * Third-Party Module
 */
import { OAuth2Client } from "google-auth-library";

/**
 * Application Config
 */
import config from "@/config";

/**
 * Initialize Google Client
 */
const googleClient = new OAuth2Client(config.google_client_id);

export default googleClient;
