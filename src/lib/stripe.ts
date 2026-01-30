import Stripe from "stripe";

// Use a dummy key during build if missing, to prevent crash.
const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_mock_for_build";

export const stripe = new Stripe(stripeKey, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: "2025-01-27.acacia" as any,
    typescript: true,
});

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("⚠️ STRIPE_SECRET_KEY is missing. Payment features will fail.");
}
