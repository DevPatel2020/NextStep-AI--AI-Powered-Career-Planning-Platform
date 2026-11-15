import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const saved = await prisma.savedResource.findMany({
            where: { user: { email: session.user.email } },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ resources: saved });
    } catch (error) {
        console.error("Failed to fetch saved resources:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json().catch(() => ({}));
        const { resourceId, title, description, url, type, source } = body;
        if (!resourceId || !title || !url) {
            return NextResponse.json({ error: "resourceId, title and url are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Upsert so double-clicking "save" doesn't 500 on the unique constraint.
        const newResource = await prisma.savedResource.upsert({
            where: { userId_resourceId: { userId: user.id, resourceId: String(resourceId) } },
            create: {
                userId: user.id,
                resourceId: String(resourceId),
                title: String(title),
                description: description ? String(description) : "",
                url: String(url),
                type: type ? String(type) : "video",
                source: source ? String(source) : "YouTube",
            },
            update: {},
        });

        return NextResponse.json({ success: true, resource: newResource });
    } catch (error) {
        console.error("Failed to save resource:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { searchParams } = req.nextUrl;
        const resourceId = searchParams.get("resourceId");

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user || !resourceId) return NextResponse.json({ error: "Missing data" }, { status: 400 });

        // deleteMany is idempotent: removing an already-removed item is not an error.
        await prisma.savedResource.deleteMany({
            where: { userId: user.id, resourceId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to unset resource:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
