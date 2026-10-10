/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * Third-Party Modules
 */
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

/**
 * Create Token
 */
const createToken = (payload: JwtPayload, secret: string, expiresIn: SignOptions) => {
    const token = jwt.sign(
        payload,
        secret,
        {
            expiresIn
        } as SignOptions
    );

    return token;
}


/**
 * Verify Token
 */
const verifyToken = (token: string, secret: string) => {
    try {
        const verifiedToken = jwt.verify(token, secret);
        return {
            success: true,
            data: verifiedToken
        };
    } catch (error: any) {
        console.log("Token verification failed:", error);
        return {
            success: false,
            error: error.message
        }
    }
}

/**
 * Export JWT Utils
 */
export const jwtUtils = {
    createToken,
    verifyToken
}