
import { withAuth } from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            const path = req.nextUrl.pathname

            // Admin routes require ADMIN role
            if (path.startsWith("/admin")) {
                return token?.role === "ADMIN"
            }

            // Vendor registration requiring login
            if (path.startsWith("/vendors/register")) {
                return !!token
            }

            // Default: Allow if logged in (for other protected routes defined in matcher)
            return !!token
        },
    },
})

export const config = {
    matcher: ["/admin/:path*", "/vendors/register", "/profile/:path*"],
}
