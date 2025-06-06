interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: number;
  status: string;
  estimatedTime: number;
  classId: string;
  class?: {
    name: string;
    difficulty: number;
    teacherStrictness: number;
  };
}

interface ScheduledTask {
  taskId: string;
  date: Date;
  duration: number;
  originalTask: Task;
  completed: boolean;
}

interface DailySchedule {
  date: Date;
  tasks: ScheduledTask[];
  totalHours: number;
  energyLevel: number;
  breaks: number;
}

// Constants for scheduling
export const MAX_DAILY_MINUTES = 360; // 6 hours maximum work per day
export const MIN_BREAK_DURATION = 15; // 15 minutes minimum break
export const BREAKS_PER_DAY = 1; // One break per day
export const TIME_INCREMENT = 15; // All work times must be in 15-minute increments
export const MIN_WORK_TIME = 15; // Minimum work time in minutes
export const WEEKEND_ENERGY_REDUCTION = 0.6; // 60% energy on weekends

// Energy levels by day of week (0 = Sunday, 1 = Monday, etc.)
const DAILY_ENERGY_LEVELS = {
  0: 0.6, // Sunday
  1: 1.0, // Monday
  2: 1.0, // Tuesday
  3: 0.9, // Wednesday
  4: 0.9, // Thursday
  5: 0.8, // Friday
  6: 0.7, // Saturday
};

// Helper function to convert hours to minutes
function hoursToMinutes(hours: number): number {
  return Math.round(hours * 60);
}

// Helper function to convert minutes to display format
function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  const hours = minutes / 60;
  return `${hours.toFixed(1)} hours`;
}

// Helper function to round to nearest 15 minutes
function roundToNearest15(minutes: number): number {
  return Math.round(minutes / TIME_INCREMENT) * TIME_INCREMENT;
}

// Helper function to check if a date is today or tomorrow
function isDueTodayOrTomorrow(dueDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  return due.getTime() === today.getTime() || due.getTime() === tomorrow.getTime();
}

// Helper function to check if a date is a weekend
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

// Calculate the energy level for a given date
function calculateEnergyLevel(date: Date): number {
  const day = date.getDay();
  let energy = DAILY_ENERGY_LEVELS[day as keyof typeof DAILY_ENERGY_LEVELS];
  
  // Reduce energy on weekends
  if (isWeekend(date)) {
    energy *= WEEKEND_ENERGY_REDUCTION;
  }
  
  return energy;
}

// Helper function to validate task data
function validateTask(task: Task): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check required fields
  if (!task.id) issues.push("Missing task ID");
  if (!task.title) issues.push("Missing task title");
  if (!task.dueDate) issues.push("Missing due date");
  
  // Validate dates
  const dueDate = new Date(task.dueDate);
  if (isNaN(dueDate.getTime())) {
    issues.push("Invalid due date format");
  }
  
  // Validate estimated time
  if (typeof task.estimatedTime !== 'number' || isNaN(task.estimatedTime)) {
    issues.push("Invalid estimated time");
  } else if (task.estimatedTime <= 0) {
    issues.push("Estimated time must be positive");
  }
  
  // Validate priority
  if (typeof task.priority !== 'number' || isNaN(task.priority)) {
    issues.push("Invalid priority");
  } else if (task.priority < 1 || task.priority > 5) {
    issues.push("Priority must be between 1 and 5");
  }
  
  // Validate class data if present
  if (task.class) {
    if (typeof task.class.difficulty !== 'number' || isNaN(task.class.difficulty)) {
      issues.push("Invalid class difficulty");
    }
    if (typeof task.class.teacherStrictness !== 'number' || isNaN(task.class.teacherStrictness)) {
      issues.push("Invalid teacher strictness");
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

// Calculate the true task load considering all factors
function calculateTaskLoad(task: Task): number {
  // Validate task first
  const validation = validateTask(task);
  if (!validation.isValid) {
    console.error(`[Scheduling] Invalid task data for "${task.title}":`, validation.issues);
    // Instead of returning MIN_WORK_TIME, use the original estimated time
    return hoursToMinutes(task.estimatedTime || 0.25); // Default to 15 minutes if no time specified
  }
  
  // Convert estimated time to minutes - this is our maximum
  const maxMinutes = hoursToMinutes(task.estimatedTime);
  
  // If the time is too small, round up to minimum work time
  if (maxMinutes < MIN_WORK_TIME) {
    return MIN_WORK_TIME;
  }
  
  // Calculate urgency score (0-1) based on factors
  let urgencyScore = 0;
  
  // Add class difficulty factor (0-0.3)
  if (task.class?.difficulty) {
    urgencyScore += (task.class.difficulty / 10); // 0-0.3
  }
  
  // Add teacher strictness factor (0-0.3)
  if (task.class?.teacherStrictness) {
    urgencyScore += (task.class.teacherStrictness / 10); // 0-0.3
  }
  
  // Add priority factor (0-0.4)
  urgencyScore += (task.priority / 10); // 0-0.4
  
  // Normalize urgency score to 0-1 range
  urgencyScore = Math.min(urgencyScore, 1);
  
  // Store the urgency score on the task for sorting/prioritization
  (task as any).urgencyScore = urgencyScore;
  
  // Return the original estimated time in minutes, rounded to nearest 15
  return roundToNearest15(maxMinutes);
}

// Helper function to log scheduling decisions
function logSchedulingDecision(
  task: Task,
  date: Date,
  decision: string,
  details?: any
) {
  console.log(`[Scheduling] Task "${task.title}" (${task.id}):`, {
    dueDate: task.dueDate,
    estimatedTime: task.estimatedTime,
    priority: task.priority,
    date: date.toISOString().split('T')[0],
    decision,
    ...details
  });
}

function distributeWorkOverDays(
  task: Task,
  startDate: Date,
  endDate: Date,
  dailySchedules: Map<string, DailySchedule>
): ScheduledTask[] {
  console.group(`📅 Distributing work for: ${task.title}`);
  
  const taskLoad = calculateTaskLoad(task);
  console.log('Task load:', {
    estimatedTime: task.estimatedTime,
    calculatedLoad: taskLoad,
    priority: task.priority
  });
  
  const dueDate = new Date(task.dueDate);
  const scheduledTasks: ScheduledTask[] = [];
  
  // Ensure minimum work time
  const effectiveTaskLoad = Math.max(taskLoad, MIN_WORK_TIME);
  
  // If due today or tomorrow, try to schedule all work for today
  if (isDueTodayOrTomorrow(dueDate)) {
    const dateKey = startDate.toISOString().split('T')[0];
    const dailySchedule = dailySchedules.get(dateKey) || {
      date: new Date(startDate),
      tasks: [],
      totalHours: 0,
      energyLevel: calculateEnergyLevel(startDate),
      breaks: 0
    };
    
    const maxMinutes = Math.floor(MAX_DAILY_MINUTES * dailySchedule.energyLevel);
    const remainingMinutes = maxMinutes - hoursToMinutes(dailySchedule.totalHours);
    
    // For tasks due today, try to schedule at least 15 minutes
    const minutesForToday = Math.max(MIN_WORK_TIME, Math.min(effectiveTaskLoad, remainingMinutes));
    
    if (minutesForToday >= MIN_WORK_TIME) {
      const roundedMinutes = roundToNearest15(minutesForToday);
      
      console.log('Scheduling for today:', {
        minutes: roundedMinutes,
        remainingMinutes,
        energyLevel: dailySchedule.energyLevel
      });
      
      scheduledTasks.push({
        taskId: task.id,
        date: new Date(startDate),
        duration: roundedMinutes,
        originalTask: task,
        completed: false
      });
      
      dailySchedule.totalHours += roundedMinutes / 60;
      dailySchedule.tasks.push(scheduledTasks[0]);
      dailySchedules.set(dateKey, dailySchedule);
    } else {
      console.log('Could not schedule for today:', {
        required: MIN_WORK_TIME,
        available: remainingMinutes,
        energyLevel: dailySchedule.energyLevel
      });
    }
    
    console.groupEnd();
    return scheduledTasks;
  }
  
  // Calculate total available days and ideal daily work
  const totalDays = Math.ceil((dueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const idealDailyWork = Math.ceil(effectiveTaskLoad / totalDays);
  
  console.log('Work distribution:', {
    totalDays,
    idealDailyWork,
    effectiveTaskLoad
  });
  
  // For tasks not due today/tomorrow, distribute work evenly
  let remainingWork = effectiveTaskLoad;
  let currentDate = new Date(startDate);
  
  while (remainingWork > 0 && currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split('T')[0];
    const dailySchedule = dailySchedules.get(dateKey) || {
      date: new Date(currentDate),
      tasks: [],
      totalHours: 0,
      energyLevel: calculateEnergyLevel(currentDate),
      breaks: 0
    };
    
    // Calculate available minutes for this day
    const maxMinutes = Math.floor(MAX_DAILY_MINUTES * dailySchedule.energyLevel);
    const remainingMinutes = maxMinutes - hoursToMinutes(dailySchedule.totalHours);
    
    // Calculate work for this day
    const daysUntilDue = Math.ceil(
      (dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    let minutesForToday = Math.min(
      idealDailyWork,
      Math.ceil(remainingWork / daysUntilDue),
      remainingMinutes
    );
    
    // Round to nearest 15 minutes
    minutesForToday = roundToNearest15(minutesForToday);
    
    console.log(`Day ${dateKey}:`, {
      minutesForToday,
      remainingMinutes,
      energyLevel: dailySchedule.energyLevel,
      daysUntilDue
    });
    
    // Only schedule if we have at least minimum work time
    if (minutesForToday >= MIN_WORK_TIME) {
      scheduledTasks.push({
        taskId: task.id,
        date: new Date(currentDate),
        duration: minutesForToday,
        originalTask: task,
        completed: false
      });
      
      remainingWork -= minutesForToday;
      dailySchedule.totalHours += minutesForToday / 60;
      dailySchedule.tasks.push(scheduledTasks[scheduledTasks.length - 1]);
      dailySchedules.set(dateKey, dailySchedule);
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  if (remainingWork > 0) {
    console.warn('Could not schedule all work:', {
      remainingWork,
      scheduledTasks: scheduledTasks.length
    });
  }
  
  console.groupEnd();
  return scheduledTasks;
}

// Add these helper functions at the top with other helpers
function parseTimeString(timeStr: string | number): number {
  if (typeof timeStr === 'number') return timeStr;
  
  // Handle "X hours" format
  const hoursMatch = timeStr.match(/(\d+(?:\.\d+)?)\s*hours?/i);
  if (hoursMatch) return parseFloat(hoursMatch[1]);
  
  // Handle "X minutes" format
  const minutesMatch = timeStr.match(/(\d+(?:\.\d+)?)\s*minutes?/i);
  if (minutesMatch) return parseFloat(minutesMatch[1]) / 60;
  
  // Try parsing as a plain number
  const num = parseFloat(timeStr);
  return isNaN(num) ? 0 : num;
}

function parsePriority(priority: string | number): number {
  if (typeof priority === 'number') return priority;
  
  const priorityMap: Record<string, number> = {
    'low': 1,
    'medium': 3,
    'high': 5
  };
  
  return priorityMap[priority.toLowerCase()] || 3; // Default to medium
}

function validateTasks(tasks: Task[]): { validTasks: Task[], skippedTasks: Task[] } {
  const validTasks: Task[] = [];
  const skippedTasks: Task[] = [];
  
  console.group('🔍 Task Validation');
  
  tasks.forEach(task => {
    const issues: string[] = [];
    
    // Check required fields
    if (!task.id) issues.push('Missing task ID');
    if (!task.title) issues.push('Missing title');
    if (!task.dueDate) issues.push('Missing due date');
    
    // Validate and convert due date
    let dueDate: Date | null = null;
    try {
      dueDate = new Date(task.dueDate);
      if (isNaN(dueDate.getTime())) {
        issues.push('Invalid due date format');
      }
    } catch (e) {
      issues.push('Failed to parse due date');
    }
    
    // Validate and convert estimated time
    const estimatedTime = parseTimeString(task.estimatedTime);
    if (isNaN(estimatedTime) || estimatedTime <= 0) {
      issues.push('Invalid estimated time');
    }
    
    // Validate and convert priority
    const priority = parsePriority(task.priority);
    if (isNaN(priority) || priority < 1 || priority > 5) {
      issues.push('Invalid priority');
    }
    
    // Validate class data
    if (task.classId && (!task.class || !task.class.difficulty || !task.class.teacherStrictness)) {
      issues.push('Missing class data');
    }
    
    if (issues.length > 0) {
      console.warn(`⚠️ Task "${task.title}" has issues:`, issues);
      console.log('Task data:', {
        id: task.id,
        title: task.title,
        dueDate: task.dueDate,
        estimatedTime: task.estimatedTime,
        priority: task.priority,
        class: task.class
      });
      skippedTasks.push(task);
    } else {
      // Convert and normalize the task data
      const validTask: Task = {
        ...task,
        dueDate: dueDate!.toISOString(),
        estimatedTime: estimatedTime,
        priority: priority
      };
      validTasks.push(validTask);
    }
  });
  
  console.log(`Validated ${tasks.length} tasks:`, {
    valid: validTasks.length,
    skipped: skippedTasks.length
  });
  console.groupEnd();
  
  return { validTasks, skippedTasks };
}

// Update calculateTaskSchedule to use the new validation
export function calculateTaskSchedule(tasks: Task[]): ScheduledTask[] {
  console.group('📅 Task Scheduling');
  console.log('Starting schedule calculation with', tasks.length, 'tasks');
  
  const { validTasks, skippedTasks } = validateTasks(tasks);
  
  if (skippedTasks.length > 0) {
    console.warn('⚠️ Some tasks were skipped due to validation issues:', skippedTasks);
  }
  
  if (validTasks.length === 0) {
    console.warn('⚠️ No valid tasks to schedule');
    console.groupEnd();
    return [];
  }
  
  // Sort tasks by due date and urgency score
  const sortedTasks = validTasks.sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    
    // First sort by due date
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    
    // Then by urgency score
    const scoreA = (a as any).urgencyScore || 0;
    const scoreB = (b as any).urgencyScore || 0;
    return scoreB - scoreA;
  });
  
  console.log('📊 Sorted tasks:', sortedTasks);
  
  const scheduledTasks: ScheduledTask[] = [];
  const now = new Date();
  const dailySchedules = new Map<string, DailySchedule>();
  
  // Schedule each task
  for (const task of sortedTasks) {
    console.log(`\n📌 Scheduling task: ${task.title}`);
    console.log('Task details:', {
      dueDate: task.dueDate,
      estimatedTime: task.estimatedTime,
      priority: task.priority,
      class: task.class?.name
    });
    
    const taskSchedule = distributeWorkOverDays(
      task,
      now,
      new Date(task.dueDate),
      dailySchedules
    );
    
    console.log(`✅ Scheduled ${taskSchedule.length} blocks for task`);
    scheduledTasks.push(...taskSchedule);
  }
  
  console.log('\n📊 Final schedule summary:', {
    totalTasks: tasks.length,
    validTasks: validTasks.length,
    skippedTasks: skippedTasks.length,
    scheduledBlocks: scheduledTasks.length
  });
  
  console.groupEnd();
  return scheduledTasks;
}

export function getTasksForDate(scheduledTasks: ScheduledTask[], date: Date): ScheduledTask[] {
  return scheduledTasks.filter(scheduled => {
    const scheduledDate = new Date(scheduled.date);
    return (
      scheduledDate.getDate() === date.getDate() &&
      scheduledDate.getMonth() === date.getMonth() &&
      scheduledDate.getFullYear() === date.getFullYear()
    );
  });
}

export function markTaskAsCompleted(taskId: string, date: Date, scheduledTasks: ScheduledTask[]): ScheduledTask[] {
  const updatedTasks = scheduledTasks.map(task => {
    if (task.taskId === taskId && 
        task.date.getDate() === date.getDate() &&
        task.date.getMonth() === date.getMonth() &&
        task.date.getFullYear() === date.getFullYear()) {
      return { ...task, completed: true };
    }
    return task;
  });
  
  // Recalculate schedule for incomplete tasks
  const incompleteTasks = updatedTasks.filter(task => !task.completed);
  if (incompleteTasks.length > 0) {
    return calculateTaskSchedule(incompleteTasks.map(task => task.originalTask));
  }
  
  return updatedTasks;
} 