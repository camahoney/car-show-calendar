import Stripe from "stripe";

export let stripe: Stripe;

try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_mock_key_for_build", {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        apiVersion: "2026-01-28.clover" as any,
    });
} catch (error) {
    console.warn("⚠️ Failed to initialize Stripe (likely during build). Using mock.");
    stripe = {
        webhooks: {
            constructEvent: () => ({ type: "mock", data: {} } as any),
        },
        checkout: {
            sessions: {
                create: () => Promise.resolve({ url: "https://mock.url" } as any),
            },
        },
    } as any;
}
