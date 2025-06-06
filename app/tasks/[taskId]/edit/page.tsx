import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { TaskForm } from "@/components/tasks/task-form"

interface EditTaskPageProps {
  params: {
    taskId: string
  }
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const task = await prisma.task.findUnique({
    where: {
      id: params.taskId,
      userId: session.user.id,
    },
  })

  if (!task) {
    redirect("/tasks")
  }

  const classes = await prisma.class.findMany({
    where: {
      userId: session.user.id,
    },
  })

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Task</h1>
        <p className="text-muted-foreground">
          Update your task details
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <TaskForm
          classes={classes}
          initialData={task}
          taskId={task.id}
        />
      </div>
    </div>
  )
} 