import path from "path";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import ejs from "ejs";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import type { TokenPayload } from "google-auth-library";
import { prisma } from "@/lib/prisma";
import { redisClient } from "@/lib/redis";
import { transporter } from "@/lib/nodemailer";
import googleClient from "@/lib/googleAuth";
import { logger } from "@/lib/winston";
import AppError from "@/middleware/AppError";
import config from "@/config";
import { jwtUtils } from "@/utils/jwt";
import {
  IGoogleLoginPayload,
  ILoginUserPayload,
  IRegisterPatientPayload,
  IRequestUser,
  IResetPasswordPayload,
  IVerifyEmailPayload,
  IChangePasswordPayload,
  ISetPasswordPayload,
} from "@/modules/v1/auth/auth.interface";
import {
  AuthProvider,
  DoctorVerificationStatus,
  Role,
  UserStatus,
} from "../../../../generated/prisma/enums";

// Send Email Verification OTP Service
const sendEmailVerificationOtp = async (email: string, name: string) => {
    const otp = crypto.randomInt(100000, 1000000).toString();
    const expirationSeconds = 5 * 60;
    const key = `email-verification-otp:${email}`;

    await redisClient.set(key, otp, {
      expiration: { type: "EX", value: expirationSeconds },
    });

    if (config.node_env === "development") {
      console.log(`[dev] Email verification OTP for ${email}: ${otp}`);
    }

    const templatePath = path.join(
      process.cwd(),
      "src/templates/email-verification.ejs",
    );
    const html = await ejs.renderFile(templatePath, {
      name,
      otp,
      expiresIn: `${expirationSeconds / 60} minutes`,
    });

    await transporter.sendMail({
      from: config.email_sender,
      to: email,
      subject: "Verify your HealthNest email",
      html,
    });
};

// Verify Email Service
const verifyEmail = async (payload: IVerifyEmailPayload) => {
    const email = payload.email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    if (user.emailVerified) {
      return;
    }

    const storedOtp = await redisClient.get(`email-verification-otp:${email}`);
    if (!storedOtp) {
      throw new AppError(httpStatus.NOT_FOUND, "OTP is expired");
    }
    if (storedOtp !== payload.otp) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });
    await redisClient.del(`email-verification-otp:${email}`);
};

// Resend OTP Service
const resendOtp = async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    if (user.emailVerified) {
      throw new AppError(httpStatus.BAD_REQUEST, "Email is already verified");
    }

    await sendEmailVerificationOtp(normalizedEmail, user.name);
};


// Register Patient Service
const registerPatient = async (payload: IRegisterPatientPayload) => {
  const { name, password, contactNumber, address } = payload;
  const email = payload.email.trim().toLowerCase();

  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User with this email already exists",
    );
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: Role.PATIENT,
      status: UserStatus.ACTIVE,
      emailVerified: false,
      patient: {
        create: {
          name,
          email,
          ...(contactNumber ? { contactNumber } : {}),
          ...(address ? { address } : {}),
        },
      },
    },
    omit: { password: true },
    include: { patient: true },
  });

  const { patient, ...user } = createdUser;
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  await sendEmailVerificationOtp(email, name);

  return {
    user,
    patient,
    accessToken,
    refreshToken,
  };
};


// Login User Service
const loginUser = async (payload: ILoginUserPayload) => {
  const { password } = payload;
  const email = payload.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
    include: { doctor: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
  }

  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password as string,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  // Doctor approval check
  if (user.role === Role.DOCTOR) {
    if (!user.emailVerified) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Doctor application email is not verified. Please verify your email first.",
      );
    }

    if (!user.doctor || user.doctor.verificationStatus !== DoctorVerificationStatus.APPROVED) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        user.doctor?.verificationStatus === DoctorVerificationStatus.REJECTED
          ? `Your doctor application has been rejected.${user.doctor.rejectionReason ? ` Reason: ${user.doctor.rejectionReason}` : ""}`
          : "Your doctor application is pending approval. An unapproved doctor cannot log in.",
      );
    }
  }

  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};


// Get My Profile Service
const getMe = async (user: IRequestUser) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      patient: true,
    },
    omit: {
      password: true,
    },
  });

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return isUserExists;
};


// Refresh Token Service
const refreshToken = async (token: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    token,
    config.jwt_refresh_secret,
  );

  if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }

  const data = verifiedRefreshToken.data as JwtPayload;

  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user || user.isDeleted || user.status !== UserStatus.ACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is inactive or not found");
  }

  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};


// Google Login Service
const googleLogin = async (payload: IGoogleLoginPayload) => {
  let googleIdPayload: TokenPayload | null | undefined = null;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: payload.idToken,
      audience: config.google_client_id,
    });
    googleIdPayload = ticket.getPayload();
  } catch (error) {
    logger.error(`Google login error: ${error}`);
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Failed to verify google token",
    );
  }

  if (!googleIdPayload || !googleIdPayload.email) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid google token");
  }

  const isPatientExist = await prisma.user.findUnique({
    where: {
      email: googleIdPayload.email,
      role: Role.PATIENT,
      googleId: googleIdPayload.sub,
    },
    include: {
      patient: true,
    },
    omit: {
      password: true,
    },
  });

  let user = isPatientExist;

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: (googleIdPayload.name || "") as string,
        email: googleIdPayload.email,
        googleId: googleIdPayload.sub,
        authProvider: AuthProvider.GOOGLE,
        role: Role.PATIENT,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        patient: {
          create: {
            name: (googleIdPayload.name || "") as string,
            email: googleIdPayload.email,
          },
        },
      },
      include: {
        patient: true,
      },
      omit: {
        password: true,
      },
    });
  }

  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  const { patient, ...userData } = user;

  return {
    accessToken,
    refreshToken,
    user: userData,
    patient,
  };
};

// Forgot Password Service
const forgotPassword = async (email: string) => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  if (isUserExist.status === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "User is Blocked");
  }

  if (!isUserExist.emailVerified) {
    throw new AppError(httpStatus.FORBIDDEN, "User Not Verified");
  }

  if (isUserExist.isDeleted || isUserExist.status === "DELETED") {
    throw new AppError(httpStatus.FORBIDDEN, "User is Deleted");
  }

  if (isUserExist.googleId && isUserExist.authProvider === "GOOGLE") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User is registered with Google. Please login using Google.",
    );
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  if (config.node_env === "development")
    console.log(`[dev] Forgot-password OTP for ${email}: ${otp}`);

  const key = `forgot-password-otp:${isUserExist.email}`;

  const expirationSeconds = 5 * 60;

  await redisClient.set(key, otp, {
    expiration: {
      type: "EX",
      value: expirationSeconds,
    },
  });

  const templatePath = path.join(
    process.cwd(),
    "src/templates/forgot-password.ejs",
  );

  const templateData = {
    name: isUserExist.name,
    otp,
    expiresIn: `${expirationSeconds / 60} minutes`,
    expirationMinutes: expirationSeconds / 60,
  };

  const html = await ejs.renderFile(templatePath, templateData);

  await transporter.sendMail({
    from: config.email_sender,
    to: isUserExist.email,
    subject: "Forgot Password",
    html,
  });
};

// Reset Password Service
const resetPassword = async (payload: IResetPasswordPayload) => {
  const { email, otp, newPassword } = payload;
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  if (isUserExist.status === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "User is Blocked");
  }

  if (!isUserExist.emailVerified) {
    throw new AppError(httpStatus.FORBIDDEN, "User Not Verified");
  }

  if (isUserExist.isDeleted || isUserExist.status === "DELETED") {
    throw new AppError(httpStatus.FORBIDDEN, "User is Deleted");
  }

  if (isUserExist.googleId && isUserExist.authProvider === "GOOGLE") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User is registered with Google. Please login using Google.",
    );
  }

  const key = `forgot-password-otp:${isUserExist.email}`;
  const storedOtp = await redisClient.get(key);

  if (!storedOtp) {
    throw new AppError(httpStatus.NOT_FOUND, "OTP is expired");
  }

  if (storedOtp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
    },
  });

  await redisClient.del(key);
};

// Change Password Service
const changePassword = async (
  userId: string,
  payload: IChangePasswordPayload,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password login is not configured");
  }

  if (!(await bcrypt.compare(payload.currentPassword, user.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Current password is incorrect");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: await bcrypt.hash(payload.newPassword, 10),
      needPasswordChange: false,
    },
  });
};

// Set Password Service
const setPassword = async (userId: string, payload: ISetPasswordPayload) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.role !== Role.PATIENT) {
    throw new AppError(httpStatus.FORBIDDEN, "Only patients can set a password");
  }
  if (!user.googleId || user.authProvider !== AuthProvider.GOOGLE) {
    throw new AppError(httpStatus.BAD_REQUEST, "Set password is only available for Google accounts");
  }
  if (user.password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is already configured");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: await bcrypt.hash(payload.newPassword, 10),
    },
  });
};

// Export Auth Service
export const AuthService = {
  registerPatient,
  loginUser,
  getMe,
  refreshToken,
  googleLogin,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendOtp,
  changePassword,
  setPassword,
};
