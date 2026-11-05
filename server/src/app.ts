/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

import express, { Request, Response, type Application } from "express";
import fs from "fs";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import httpStatus from "http-status";
import swaggerUi from "swagger-ui-express";

import config from "@/config";
import { globalErrorHandler } from "@/middleware/globalErrorHandler";
import { notFound } from "@/middleware/notFound";
import router from "@/routes/v1/routes";
import { scheduleRoutes } from "@/modules/v1/schedule/schedule.routes";
import { doctorRoutes } from "@/modules/v1/doctor/doctor.route";
import { prescriptionRoutes } from "@/modules/v1/prescription/prescription.routes";
import { refundRoutes } from "@/modules/v1/refund/refund.routes";
import { paymentController } from "@/modules/v1/payment/payment.controller";

// Initialize Express Application
const app: Application = express();

// HTTP Security Headers Middleware
app.use(
  helmet({
    contentSecurityPolicy: config.node_env === "production",
  }),
);

// CORS Configuration
app.use(
  cors({
    origin: config.frontend_url,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

// Stripe Webhook Route
app.post(
  "/api/v1/payments/stripe/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleStripeWebhook,
);

// Body Parsing Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

// Cookie Parsing Middleware
app.use(cookieParser());

// OpenAPI YAML document for Swagger Editor and API tooling.
app.get("/api/docs/openapi.yaml", (_req: Request, res: Response) => {
  const specificationPath = path.join(process.cwd(), "docs/openapi.yaml");

  if (!fs.existsSync(specificationPath)) {
    res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "OpenAPI specification not found",
    });
    return;
  }

  res.type("application/yaml").send(fs.readFileSync(specificationPath, "utf8"));
});

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/api/docs/openapi.yaml",
    },
  })
);

// API Routes
app.use("/api/v1", router);
app.use("/refunds", refundRoutes);
app.use("/refund", refundRoutes);

// Root Route
app.get("/", async (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to HelthNest Backend",
    env: config.node_env,
    time: new Date().toLocaleTimeString(),
  });
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

// Not Found Middleware
app.use(notFound);

// Export Application
export default app;
