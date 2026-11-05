import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { auth } from "@/middleware/checkAuth";
import validateRequest from "@/middleware/validateRequest";
import { z } from "zod";
import { paymentController } from "./payment.controller";

const router = Router();
router.post(
  "/checkout/:appointmentId",
  auth(Role.PATIENT),
  validateRequest(z.object({ params: z.object({ appointmentId: z.string().uuid() }) })),
  paymentController.createCheckout,
);

export const paymentRoutes = router;
export default router;
