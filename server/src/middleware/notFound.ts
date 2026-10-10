/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * Third-Party Modules
 */
import { Request, Response } from "express"
import httpStatus from "http-status"

/**
 * Not Found Middleware
 */
export const notFound = (req: Request, res: Response) => {
    res.status(httpStatus.NOT_FOUND).json({
        message: "Route not found",
        path: req.originalUrl,
        date: new Date()
    })
}