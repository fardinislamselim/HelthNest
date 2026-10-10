/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * Third-Party Modules
 */
import {type NextFunction, type Request,type RequestHandler,type Response } from 'express';

/**
 * Catch Async Function
 */
const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(err => next(err));
  };
};

/**
 * Export Catch Async
 */
export default catchAsync;