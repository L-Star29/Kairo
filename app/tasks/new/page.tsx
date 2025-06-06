import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { TaskForm } from "@/components/tasks/task-form"

export default async function NewTaskPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const classes = await prisma.class.findMany({
    where: {
      userId: session.user.id,
    },
  })

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Task</h1>
        <p className="text-muted-foreground">
          Add a new task to your schedule
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <TaskForm classes={classes} />
      </div>
    </div>
  )
} 