import { isAxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/api";

/**
 * Normalized application API error
 */
export class NormalizedApiError extends Error {
  public readonly statusCode: number;
  public readonly errors?: unknown;

  constructor(message: string, statusCode: number = 500, errors?: unknown) {
    super(message);
    this.name = "NormalizedApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

/**
 * Extracts a clean, human-readable error message from an unknown error or Axios response
 */
export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const responseData = error.response?.data;
    if (responseData?.message) {
      return responseData.message;
    }

    if (error.response?.status === 401) {
      return "Your session has expired or you are not authorized. Please log in.";
    }

    if (error.response?.status === 403) {
      return "You do not have permission to perform this action.";
    }

    if (error.response?.status === 404) {
      return "The requested resource could not be found.";
    }

    if (error.response?.status === 409) {
      return "A conflict occurred with the current state of the resource.";
    }

    if (error.response?.status === 422) {
      return "The submitted data was invalid. Please check the fields and try again.";
    }

    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return "The server took too long to respond. Please try again.";
    }

    if (!error.response && error.request) {
      return "Unable to connect to the server. Please check your network connection.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again later.";
}

/**
 * Normalizes an unknown error into a structured NormalizedApiError
 */
export function normalizeApiError(error: unknown): NormalizedApiError {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const status = error.response?.status ?? 500;
    const message = error.response?.data?.message || getApiErrorMessage(error);
    const details = error.response?.data?.error;
    return new NormalizedApiError(message, status, details);
  }

  if (error instanceof NormalizedApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new NormalizedApiError(error.message, 500);
  }

  return new NormalizedApiError("An unknown error occurred", 500);
}

