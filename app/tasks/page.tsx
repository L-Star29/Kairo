"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskList } from "@/components/tasks/task-list";
import { TaskForm } from "@/components/tasks/task-form";

export default function TasksPage() {
  const [isAddingTask, setIsAddingTask] = useState(false);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button onClick={() => setIsAddingTask(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {isAddingTask && (
        <div className="mb-6">
          <TaskForm onClose={() => setIsAddingTask(false)} />
        </div>
      )}

      <TaskList />
    </div>
  );
} 