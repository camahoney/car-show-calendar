import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            const path = req.nextUrl.pathname;

            // Admin Protection
            if (path.startsWith("/admin")) {
                return token?.role === "ADMIN";
            }

            // Dashboard Protection
            if (path.startsWith("/dashboard")) {
                return !!token;
            }
            return true;
        },
    },
});

export const config = {
    matcher: ["/dashboard/:path*", "/api/upload/:path*", "/admin/:path*"],
};
