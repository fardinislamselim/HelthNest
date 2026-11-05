/**
 * @copyright 2026
 * @author HealthNest Team
 * @license Apache-2.0
 */

import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { auth } from "@/middleware/checkAuth";
import validateRequest from "@/middleware/validateRequest";
import { refundController } from "./refund.controller";
import { RefundValidation } from "./refund.validation";

const router = Router();

// Internal/Admin refund processing
router.post(
  "/",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(RefundValidation.processRefundBody),
  refundController.processRefund,
);

// Patient: retrieve own refund history
router.get(
  "/my-refunds",
  auth(Role.PATIENT),
  validateRequest(RefundValidation.listQuery),
  refundController.getMyRefunds,
);

// Patient / Admin: view specific refund details
router.get(
  "/:refundId",
  auth(Role.PATIENT, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(RefundValidation.refundIdParams),
  refundController.getRefundById,
);

export const refundRoutes = router;
export default router;

