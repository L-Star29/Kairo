import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, difficulty, teacherName, teacherStrictness } = body;

    if (!name || !difficulty || !teacherName || !teacherStrictness) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const updatedClass = await prisma.class.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        name,
        difficulty,
        teacherName,
        teacherStrictness,
      },
    });

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error("[CLASS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.class.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CLASS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 