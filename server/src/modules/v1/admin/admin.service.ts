import crypto from "crypto";
import ejs from "ejs";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import path from "path";
import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/nodemailer";
import { logger } from "@/lib/winston";
import config from "@/config";
import AppError from "@/middleware/AppError";
import { Role, UserStatus } from "../../../../generated/prisma/enums";
import { TCreateAdmin } from "./admin.interface";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  personalEmail: true,
  role: true,
  status: true,
  needPasswordChange: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

const getNameFromEmail = (email: string) =>
  email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const generateTemporaryPassword = () =>
  `${crypto.randomBytes(9).toString("base64url")}A1!`;

const sendCredentialsEmail = async (user: {
  name: string;
  email: string;
  personalEmail: string;
}, password: string) => {
  const html = await ejs.renderFile(
    path.join(process.cwd(), "src/templates/admin-credentials.ejs"),
    {
      name: user.name,
      organizationEmail: user.email,
      password,
    },
  );

  await transporter.sendMail({
    from: config.email_sender,
    to: user.personalEmail,
    subject: "Your HealthNest administrator account",
    html,
  });
};

const createAdmin = async (payload: TCreateAdmin, role: Role.ADMIN | Role.SUPER_ADMIN) => {
  if (payload.organizationEmail === payload.personalEmail) {
    throw new AppError(httpStatus.BAD_REQUEST, "Organization and personal emails must be different");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: payload.organizationEmail },
  });
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, "Organization email is already in use");
  }

  const temporaryPassword = generateTemporaryPassword();
  const password = await bcrypt.hash(
    temporaryPassword,
    Number(config.bcrypt_salt_rounds) || 12,
  );
  const user = await prisma.user.create({
    data: {
      name: payload.name || getNameFromEmail(payload.organizationEmail),
      email: payload.organizationEmail,
      personalEmail: payload.personalEmail,
      password,
      role,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      needPasswordChange: true,
    },
    select: publicUserSelect,
  });

  try {
    await sendCredentialsEmail(user, temporaryPassword);
  } catch (error) {
    logger.error("Admin account created but credentials email could not be sent:", error);
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "Admin account was created, but the credentials email could not be sent",
    );
  }

  return user;
};

const listAdmins = async (role: Role.ADMIN | Role.SUPER_ADMIN) =>
  prisma.user.findMany({
    where: { role, isDeleted: false },
    select: publicUserSelect,
    orderBy: { createdAt: "desc" },
  });

const getUserById = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, isDeleted: false },
    select: publicUserSelect,
  });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  return user;
};

const setAdminBlocked = async (
  userId: string,
  role: Role.ADMIN | Role.SUPER_ADMIN,
  status: UserStatus.BLOCKED | UserStatus.ACTIVE,
) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, role, isDeleted: false },
  });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "Administrator not found");

  return prisma.user.update({
    where: { id: userId },
    data: { status },
    select: publicUserSelect,
  });
};

export const adminService = {
  createAdmin,
  listAdmins,
  getUserById,
  setAdminBlocked,
};
