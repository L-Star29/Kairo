export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  OVERDUE = "OVERDUE",
}

export interface CreateTaskData {
  title: string
  description?: string | null
  dueDate: Date
  priority: number
  classId: string
  estimatedTime: number
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  status?: TaskStatus
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: number;
  status: string;
  estimatedTime: number;
  classId?: string;
  class?: {
    name: string;
    difficulty: number;
    teacherStrictness: number;
  };
}

export interface ScheduledTask {
  taskId: string;
  date: Date;
  duration: number;
  originalTask: Task;
  completed: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  extendedProps: {
    task: Task;
    duration: number;
    priority: number;
    class?: {
      name: string;
      color: string;
    };
  };
} 