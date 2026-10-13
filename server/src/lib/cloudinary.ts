/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * Third-Party Module
 */
import { v2 as Cloudinary } from "cloudinary";


/**
 * Application Module
 */
import config from "@/config";

/**
 * Configure Cloudinary
 */
Cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
  secure: true,
});


export const cloudinary = Cloudinary