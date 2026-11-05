import Stripe from "stripe";
import httpStatus from "http-status";

import config from "@/config";
import AppError from "@/middleware/AppError";

let stripeClient: Stripe | null = null;

const stripe = (): Stripe => {
  if (!config.stripe_secret_key) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "Stripe payments are not configured"
    );
  }

  if (!stripeClient) {
    stripeClient = new Stripe(config.stripe_secret_key);
  }

  return stripeClient;
};

export default stripe;