import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Ignore errors from unsupported WebView browsers (e.g. Facebook in-app browser)
    ignoreErrors: [
        "InvalidAccessError",
        "The object does not support the operation or argument",
    ],

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
});
