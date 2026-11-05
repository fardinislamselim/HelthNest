import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { appointmentService } from "./appointment.service";
import { Role } from "../../../../generated/prisma/enums";

const createAppointment = catchAsync(async (req: Request, res: Response) => {
  const result = await appointmentService.createAppointment(req.user!.userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Appointment booking request created successfully",
    data: result,
  });
});

const getPatientAppointments = catchAsync(async (req: Request, res: Response) => {
  const result = await appointmentService.listPatientAppointments(req.user!.userId, req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your appointments retrieved successfully",
    data: result.appointments,
    meta: { page: result.meta.page, limit: result.meta.limit, total: result.meta.total, totalPage: result.meta.totalPages },
  });
});

const getDoctorAppointments = catchAsync(async (req: Request, res: Response) => {
  const result = await appointmentService.listDoctorAppointments(req.user!.userId, req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor appointments retrieved successfully",
    data: result.appointments,
    meta: { page: result.meta.page, limit: result.meta.limit, total: result.meta.total, totalPage: result.meta.totalPages },
  });
});

const getAppointment = catchAsync(async (req: Request, res: Response) => {
  const appointment = await appointmentService.getOwnAppointment(
    req.user!.userId,
    req.user!.role,
    String(req.params.appointmentId),
  );
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Appointment details retrieved successfully", data: { appointment } });
});

const startAppointment = catchAsync(async (req: Request, res: Response) => {
  const appointment = await appointmentService.startAppointment(req.user!.userId, String(req.params.appointmentId));
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Consultation started successfully", data: { appointment } });
});

const completeAppointment = catchAsync(async (req: Request, res: Response) => {
  const appointment = await appointmentService.completeAppointment(req.user!.userId, String(req.params.appointmentId));
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Consultation completed successfully", data: { appointment } });
});

const cancelAppointment = catchAsync(async (req: Request, res: Response) => {
  const result = await appointmentService.cancelAppointment(req.user!.userId, String(req.params.appointmentId));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message || "Appointment cancelled successfully",
    data: result,
  });
});


export const appointmentController = {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getAppointment,
  startAppointment,
  completeAppointment,
  cancelAppointment,
};
