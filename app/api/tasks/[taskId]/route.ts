import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { title, description, dueDate, priority, estimatedTime, classId } = body

    if (!title || !description || !dueDate || !priority || !estimatedTime || !classId) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Convert priority string to number
    const priorityMap = {
      low: 1,
      medium: 2,
      high: 3,
    }

    const task = await prisma.task.update({
      where: {
        id: params.taskId,
        userId: session.user.id,
      },
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        priority: priorityMap[priority as keyof typeof priorityMap],
        estimatedTime,
        classId,
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("[TASK_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.task.delete({
      where: {
        id: params.taskId,
        userId: session.user.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[TASK_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 