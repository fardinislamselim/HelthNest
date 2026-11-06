import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { refundService } from "./refund.service";

const processRefund = catchAsync(async (req: Request, res: Response) => {
  const refund = await refundService.processRefundForAppointment(
    String(req.body.appointmentId),
    req.body.reason,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Refund processed successfully",
    data: refund,
  });
});

const getMyRefunds = catchAsync(async (req: Request, res: Response) => {
  const result = await refundService.getMyRefunds(
    req.user!.userId,
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your refunds retrieved successfully",
    data: result.refunds,
    meta: {
      page: result.meta.page,
      limit: result.meta.limit,
      total: result.meta.total,
      totalPage: result.meta.totalPage,
    },
  });
});

const getRefundById = catchAsync(async (req: Request, res: Response) => {
  const refund = await refundService.getRefundById(
    req.user!.userId,
    req.user!.role,
    String(req.params.refundId),
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Refund details retrieved successfully",
    data: refund,
  });
});

export const refundController = {
  processRefund,
  getMyRefunds,
  getRefundById,
};
