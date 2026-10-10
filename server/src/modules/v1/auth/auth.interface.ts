/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * Third-Party Modules
 */
import { Role } from "../../../../generated/prisma/enums"


/**
 * Interface for Login User Payload
 */
export interface ILoginUserPayload {
    email: string
    password: string
}

/**
 * Interface for Register Patient Payload
 */
export interface IRegisterPatientPayload {
    name: string
    email: string
    password: string
}

/**
 * Interface for Request User
 */
export interface IRequestUser {
    userId: string
    email: string
    name: string
    role: Role
}

/**
 * Interface for Google Login Payload
 */
export interface IGoogleLoginPayload {
    idToken: string
}


