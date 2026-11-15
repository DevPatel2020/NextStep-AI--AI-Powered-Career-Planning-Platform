import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const courses = await prisma.course.findMany({
        where: { authorId: session.user.id },
        include: { sections: { include: { lectures: true } } },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ courses });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, description, price } = await req.json().catch(() => ({}));
    if (typeof title !== "string" || !title.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    const numericPrice = price === undefined || price === null || price === "" ? 0 : Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0)
        return NextResponse.json({ error: "Price must be a non-negative number" }, { status: 400 });

    const course = await prisma.course.create({
        data: {
            title: title.trim().slice(0, 200),
            description: typeof description === "string" ? description : "",
            price: numericPrice,
            status: "DRAFT",
            authorId: session.user.id,
        },
    });
    return NextResponse.json({ course });
}
