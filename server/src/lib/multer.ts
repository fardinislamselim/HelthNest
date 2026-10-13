/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * Third-Party Module
 */
import multer from "multer";


/**
 * Memory Storage Configuration for Multer
 * Stores files in memory as Buffers rather than on disk
 */
const storage = multer.memoryStorage();

/**
 * Multer Initialization with Memory Storage
 */
export const upload = multer({ storage });