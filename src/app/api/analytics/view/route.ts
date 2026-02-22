import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const BOT_USER_AGENTS = /bot|crawler|spider|crawling|lighthouse|Googlebot|bingbot|yandex|Datanyze|Slackbot|Discordbot|Twitterbot|facebookexternalhit|LinkedInBot|Discord/i;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { eventId } = body;

        if (!eventId) {
            return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
        }

        const userAgent = req.headers.get("user-agent") || "";

        // Filter out obvious bots
        if (BOT_USER_AGENTS.test(userAgent)) {
            // Return success but don't count it to save DB calls and avoid tracking bots
            return NextResponse.json({ success: true, ignored: "bot" });
        }

        // Fetch session to check if user is admin or the event owner
        const user = await getCurrentUser();

        if (user) {
            // if admin, don't count
            if (user.role === "ADMIN") {
                return NextResponse.json({ success: true, ignored: "admin" });
            }

            // check if user is the event organizer
            const event = await prisma.event.findUnique({
                where: { id: eventId },
                select: {
                    organizer: {
                        select: { userId: true }
                    }
                }
            });

            if (event?.organizer?.userId === user.id) {
                return NextResponse.json({ success: true, ignored: "owner" });
            }
        }

        await prisma.event.update({
            where: { id: eventId },
            data: { views: { increment: 1 } },
        });

        revalidatePath(`/events/${eventId}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("View tracking error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
