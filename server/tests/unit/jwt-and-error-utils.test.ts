import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { jwtUtils } from "../../src/utils/jwt.ts";
import AppError from "../../src/middleware/AppError.ts";

describe("JWT Utilities", () => {
  const secret = "test-secret-key-healthnest-123456789";
  const payload = {
    userId: "test-user-id-123",
    email: "patient@healthnest.test",
    role: "PATIENT",
  };

  it("should create a valid JWT and verify it successfully", () => {
    const token = jwtUtils.createToken(payload, secret, "1h" as any);
    assert.ok(typeof token === "string", "Token must be a string");
    assert.ok(token.length > 20, "Token must be non-empty");

    const verification = jwtUtils.verifyToken(token, secret);
    assert.equal(verification.success, true);
    assert.equal((verification.data as any).userId, payload.userId);
    assert.equal((verification.data as any).email, payload.email);
    assert.equal((verification.data as any).role, payload.role);
  });

  it("should fail verification with wrong secret", () => {
    const token = jwtUtils.createToken(payload, secret, "1h" as any);
    const verification = jwtUtils.verifyToken(token, "wrong-secret-key-99999");
    assert.equal(verification.success, false);
    assert.ok(verification.error, "Should contain error message");
  });

  it("should fail verification for a malformed token", () => {
    const verification = jwtUtils.verifyToken("invalid.token.string", secret);
    assert.equal(verification.success, false);
    assert.ok(verification.error);
  });
});

describe("AppError Utility", () => {
  it("should create an AppError with status code and operational flag", () => {
    const error = new AppError(404, "Schedule not found");
    assert.equal(error.statusCode, 404);
    assert.equal(error.message, "Schedule not found");
    assert.equal(error.isOperational, true);
    assert.ok(error instanceof Error, "Should inherit from Error");
  });

  it("should capture stack trace properly", () => {
    const error = new AppError(400, "Bad Request");
    assert.ok(error.stack, "Stack trace should be defined");
  });
});
