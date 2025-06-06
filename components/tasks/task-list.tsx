"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
// import { Task } from "@prisma/client"; // We'll use any for now to avoid type issues
import { format } from "date-fns"
import { TaskActions } from "./task-actions"

export function TaskList() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
    if (session?.user) {
      fetchTasks();
    }
  }, [session]);

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No tasks yet. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Title
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Class
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Due Date
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Priority
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Status
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-b">
              <td className="p-4 align-middle">{task.title}</td>
              <td className="p-4 align-middle">{task.class?.name || "-"}</td>
              <td className="p-4 align-middle">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</td>
              <td className="p-4 align-middle">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    task.priority === 1
                      ? "bg-green-100 text-green-800"
                      : task.priority === 2
                      ? "bg-blue-100 text-blue-800"
                      : task.priority === 3
                      ? "bg-yellow-100 text-yellow-800"
                      : task.priority === 4
                      ? "bg-orange-100 text-orange-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {task.priority === 1
                    ? "Low"
                    : task.priority === 2
                    ? "Medium"
                    : task.priority === 3
                    ? "High"
                    : task.priority === 4
                    ? "Urgent"
                    : "Critical"}
                </span>
              </td>
              <td className="p-4 align-middle">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    task.status === "PENDING"
                      ? "bg-gray-100 text-gray-800"
                      : task.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-800"
                      : task.status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {task.status === "PENDING"
                    ? "Pending"
                    : task.status === "IN_PROGRESS"
                    ? "In Progress"
                    : task.status === "COMPLETED"
                    ? "Completed"
                    : "Overdue"}
                </span>
              </td>
              <td className="p-4 align-middle">
                <TaskActions task={task} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 