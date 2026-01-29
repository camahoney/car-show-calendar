import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    return NextResponse.json({ url: `${process.env.NEXTAUTH_URL}/dashboard?checkout_disabled=true` });
}
