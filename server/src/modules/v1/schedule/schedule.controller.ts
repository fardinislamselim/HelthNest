/**
 * @copyright 2026
 * @author HealthNest Team
 * @license Apache-2.0
 */

import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { scheduleService } from "./schedule.service";

/**
 * Create a new consultation schedule
 */
const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleService.createSchedule(req.user!.userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Schedule created successfully",
    data: {
      schedule: result,
    },
  });
});

/**
 * Retrieve all schedules belonging to the authenticated doctor
 */
const getMySchedules = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleService.getMySchedules(req.user!.userId, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedules retrieved successfully",
    data: {
      schedules: result.schedules,
      meta: result.meta,
    },
    meta: {
      page: result.meta.page,
      limit: result.meta.limit,
      total: result.meta.total,
      totalPage: result.meta.totalPages,
    },
  });
});

/**
 * Retrieve a specific schedule belonging to the authenticated doctor
 */
const getScheduleById = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleService.getScheduleById(
    req.user!.userId,
    String(req.params.scheduleId),
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule details retrieved successfully",
    data: {
      schedule: result,
    },
  });
});

/**
 * Update an existing schedule
 */
const updateSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleService.updateSchedule(
    req.user!.userId,
    String(req.params.scheduleId),
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule updated successfully",
    data: {
      schedule: result,
    },
  });
});

/**
 * Publish a draft or unpublished schedule
 */
const publishSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleService.publishSchedule(
    req.user!.userId,
    String(req.params.scheduleId),
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule published successfully",
    data: {
      schedule: result,
    },
  });
});

/**
 * Unpublish an existing published schedule
 */
const unpublishSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleService.unpublishSchedule(
    req.user!.userId,
    String(req.params.scheduleId),
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule unpublished successfully",
    data: {
      schedule: result,
    },
  });
});

/**
 * Delete an eligible schedule
 */
const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  await scheduleService.deleteSchedule(
    req.user!.userId,
    String(req.params.scheduleId),
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule deleted successfully",
    data: null,
  });
});

/**
 * Patient: Retrieve all doctors' available schedules for today
 */
const getTodayAvailableSchedules = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleService.getTodayAvailableSchedules(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Today's available schedules retrieved successfully",
    data: result.schedules,
    meta: {
      page: result.meta.page,
      limit: result.meta.limit,
      total: result.meta.total,
      totalPage: result.meta.totalPages,
    },
  });
});

/**
 * Patient: Retrieve available slots for a schedule
 */
const getScheduleAvailableSlots = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleService.getScheduleAvailableSlots(
    String(req.params.scheduleId),
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule slots retrieved successfully",
    data: result,
  });
});

/**
 * Patient: Retrieve unique doctors available today
 */
const getDoctorsAvailableToday = catchAsync(async (_req: Request, res: Response) => {
  const result = await scheduleService.getDoctorsAvailableToday();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Available doctors retrieved successfully",
    data: result,
  });
});

export const scheduleController = {
  createSchedule,
  getMySchedules,
  getScheduleById,
  updateSchedule,
  publishSchedule,
  unpublishSchedule,
  deleteSchedule,
  getTodayAvailableSchedules,
  getScheduleAvailableSlots,
  getDoctorsAvailableToday,
};

