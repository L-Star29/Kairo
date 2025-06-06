import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function CreateTaskButton() {
  const router = useRouter()

  return (
    <Button onClick={() => router.push("/tasks/new")}>
      <Plus className="mr-2 h-4 w-4" />
      Create Task
    </Button>
  )
} 