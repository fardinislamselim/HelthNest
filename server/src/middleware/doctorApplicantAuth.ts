import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";

import catchAsync from "@/utils/catchAsync";
import config from "@/config";
import { jwtUtils } from "@/utils/jwt";
import { prisma } from "@/lib/prisma";
import AppError from "@/middleware/AppError";

export const doctorApplicantAuth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    if (token) {
      const verifiedToken = jwtUtils.verifyToken(
        token,
        config.jwt_access_secret,
      );
      if (verifiedToken.success && verifiedToken.data) {
        const { email, name, userId, role } = verifiedToken.data as JwtPayload;

        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { doctor: true },
        });

        if (user && user.status !== "BLOCKED") {
          req.user = {
            email: user.email,
            name: user.name,
            userId: user.id,
            role: user.role,
          };
          return next();
        }
      }
    }

    // Fallback: check if applicant email is provided in query or header
    const email =
      (req.query.email as string) || (req.headers["x-doctor-email"] as string);

    if (email) {
      const user = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
        include: { doctor: true },
      });

      if (user && user.doctor && user.status !== "BLOCKED") {
        req.user = {
          email: user.email,
          name: user.name,
          userId: user.id,
          role: user.role,
        };
        return next();
      }
    }

    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Doctor applicant authentication required. Please provide a valid token or application email.",
    );
  },
);
