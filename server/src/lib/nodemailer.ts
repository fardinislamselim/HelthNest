/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * Third-Party Modules
 */
import nodemailer from "nodemailer";

/**
 * Internal Module
 */
import config from "@/config";

/**
 * Create Nodemailer Transporter
 */
export const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: config.email_user,
		pass: config.email_pass,
	},
});