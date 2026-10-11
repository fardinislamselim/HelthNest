/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * Third-Party Modules
 */
import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import type { ZodType } from "zod";

/**
 * Application Libs
 */
import { logger } from "@/lib/winston";

/**
 * Application Utils
 */
import catchAsync from "@/utils/catchAsync";

/**
 * Application Middleware
 */
import AppError from "@/middleware/AppError";

/**
 * Validate Request Middleware
 */
const validateRequest = (zodSchema: ZodType) => {
	return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
		const isNestedSchema = Boolean(
			(zodSchema as any)?.shape &&
				("body" in (zodSchema as any).shape ||
					"cookies" in (zodSchema as any).shape ||
					"query" in (zodSchema as any).shape ||
					"params" in (zodSchema as any).shape)
		);

		const bodyData = {
			...(typeof req.body === "object" && req.body !== null ? req.body : {}),
			...(req.cookies?.refreshToken && !req.body?.refreshToken
				? { refreshToken: req.cookies.refreshToken }
				: {}),
		};

		const payload = isNestedSchema
			? {
					body: bodyData,
					cookies: req.cookies ?? {},
					query: req.query ?? {},
					params: req.params ?? {},
			  }
			: bodyData;

		const result = await zodSchema.safeParseAsync(payload);

		if (!result.success) {
			logger.error(`Validation error: ${result.error}`);
			throw new AppError(httpStatus.BAD_REQUEST, result.error.issues[0].message);
		}

		if (isNestedSchema && result.data && typeof result.data === "object") {
			const data = result.data as Record<string, any>;
			if ("body" in data) {
				req.body = data.body;
			}
			if ("cookies" in data) {
				req.cookies = data.cookies;
			}
			if ("query" in data) {
				req.query = data.query;
			}
			if ("params" in data) {
				req.params = data.params;
			}
		} else {
			req.body = result.data;
		}

		next();
	});
};

/**
 * Export Validate Request
 */
export default validateRequest;