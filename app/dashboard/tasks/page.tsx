"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/components/tasks/task-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: number;
  status: string;
  estimatedTime: number;
  classId: string;
  class?: {
    name: string;
  };
}

interface Class {
  id: string;
  name: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchClasses();
  }, []);

  async function fetchTasks() {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchClasses() {
    try {
      const response = await fetch("/api/classes");
      if (!response.ok) throw new Error("Failed to fetch classes");
      const data = await response.json();
      setClasses(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error fetching classes:", err);
      setClasses([]);
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleTaskFormClose = () => {
    setShowTaskForm(false);
    setEditingTask(null);
    fetchTasks(); // Refresh tasks after form closes
  };

  const handleDelete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      fetchTasks(); // Refresh tasks after deletion
      setDeletingTask(null);
      setDeletingTaskId(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return "Low";
      case 2:
        return "Medium";
      case 3:
        return "High";
      default:
        return "Unknown";
    }
  };

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

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
        <div className="mb-6 p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
          <TaskForm onClose={() => setIsAddingTask(false)} classes={classes} />
        </div>
      )}

      {showTaskForm && (
        <div className="mb-6 p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">
            {editingTask ? "Edit Task" : "Add New Task"}
          </h2>
          <TaskForm
            onClose={handleTaskFormClose}
            initialData={editingTask || undefined}
            taskId={editingTask?.id}
            classes={classes}
          />
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No tasks yet. Add your first task!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{task.title}</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(task)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setDeletingTask(task);
                      setDeletingTaskId(task.id);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {task.description}
              </p>
              <p className="text-sm text-muted-foreground">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Priority: {getPriorityLabel(task.priority)}
              </p>
              <p className="text-sm text-muted-foreground">
                Estimated Time: {task.estimatedTime} hours
              </p>
              <p className="text-sm text-muted-foreground">
                Class: {task.class?.name || "Unassigned"}
              </p>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deletingTask} onOpenChange={() => setDeletingTask(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingTask) {
                  handleDelete(deletingTask.id);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 