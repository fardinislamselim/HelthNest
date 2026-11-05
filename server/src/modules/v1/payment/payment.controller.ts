import type { Request, Response } from "express";
import httpStatus from "http-status";
import Stripe from "stripe";
import config from "@/config";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import AppError from "@/middleware/AppError";
import { paymentService } from "./payment.service";

const createCheckout = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.createCheckoutSession(
    String(req.params.appointmentId),
    req.user!.userId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stripe checkout session created",
    data: result,
  });
});

const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
  if (!config.stripe_webhook_secret) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "Stripe webhook is not configured",
    );
  }
  const signature = req.headers["stripe-signature"];
  if (typeof signature !== "string" || !Buffer.isBuffer(req.body)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid Stripe webhook request",
    );
  }
  let event: Stripe.Event;
  try {
    event = new Stripe(config.stripe_secret_key).webhooks.constructEvent(
      req.body,
      signature,
      config.stripe_webhook_secret,
    );
  } catch {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid Stripe webhook signature",
    );
  }
  await paymentService.handleStripeEvent(event);
  res.status(httpStatus.OK).json({ received: true });
});

export const paymentController = { createCheckout, handleStripeWebhook };
