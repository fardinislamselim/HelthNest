/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * Third-Party Modules
 */
import type { Response } from "express";

/**
 * Meta Interface
 */
interface Imeta {
    limit:number;
    page: number;
    total: number;
    totalPage: number;
}

/**
 * Response Interface
 */
interface IResponse <T> {
    statusCode : number;
    success: boolean;
    message?: string;
    data: T;
    meta?:Imeta

}

/**
 * Send Response
 */
const sendResponse =<T>(res:Response, data:IResponse<T>)=>{
res.status(data?.statusCode).json({
    success: data?.success,
    message:data?.message,
    data:data?.data || {} || [],
    meta: data?.meta
}) 
}

/**
 * Export Send Response
 */
export default sendResponse