/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * App Error Class
 */
class AppError extends Error {
    public statusCode : number

    constructor (statusCode:number, message:string, stack= "") {
        super(message);
        this.statusCode=statusCode

        if(stack){
            this.stack = stack
        }else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

/**
 * Export App Error
 */
export default AppError