import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma, getCachedData, clearCache } from "@/lib/db"
import { CreateTaskData } from "@/lib/types"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
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

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        priority: priorityMap[priority as keyof typeof priorityMap],
        estimatedTime,
        classId,
        userId: user.id,
      },
      include: {
        class: {
          select: {
            name: true,
          },
        },
      },
    })

    // Clear tasks cache for this user
    clearCache(`tasks-${user.id}`)

    return NextResponse.json(task)
  } catch (error) {
    console.error("[TASKS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const tasks = await getCachedData(
      `tasks-${user.id}`,
      () => prisma.task.findMany({
        where: { userId: user.id },
        orderBy: { dueDate: 'asc' },
        include: { class: true }
      })
    )

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 