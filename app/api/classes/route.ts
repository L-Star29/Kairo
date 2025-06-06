import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma, getCachedData, clearCache } from "@/lib/db"

export async function GET() {
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

    const classes = await getCachedData(
      `classes-${user.id}`,
      () => prisma.class.findMany({
        where: { userId: user.id },
        orderBy: { name: 'asc' }
      })
    )

    return NextResponse.json(classes)
  } catch (error) {
    console.error('Error fetching classes:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

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
    const { name, difficulty, teacherName, teacherStrictness } = body

    if (!name || !difficulty || !teacherName || !teacherStrictness) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const classItem = await prisma.class.create({
      data: {
        name,
        difficulty,
        teacherName,
        teacherStrictness,
        userId: user.id,
      },
    })

    // Clear classes cache for this user
    clearCache(`classes-${user.id}`)

    return NextResponse.json(classItem)
  } catch (error) {
    console.error('Error creating class:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 