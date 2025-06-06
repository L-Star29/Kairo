"use client";

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg } from '@fullcalendar/core';
import type { DateClickArg } from '@fullcalendar/interaction';
import { Task, ScheduledTask, CalendarEvent } from '@/lib/types';
import { calculateTaskSchedule } from '@/lib/scheduling';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CalendarEventData {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor: string;
  textColor: string;
  extendedProps: {
    taskId: string;
    description?: string;
    priority: number;
    class?: {
      name: string;
      color: string;
    };
    completed: boolean;
  };
}

export default function CalendarPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);
  const [events, setEvents] = useState<CalendarEventData[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [view, setView] = useState('dayGridMonth');

  // Generate a random color that's visually distinct and hasn't been used yet
  const generateRandomColor = (usedColors: string[]) => {
    const colors = [
      '#3b82f6', // blue
      '#22c55e', // green
      '#f59e0b', // amber
      '#ef4444', // red
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#14b8a6', // teal
      '#f97316', // orange
      '#84cc16', // lime
      '#06b6d4', // cyan
      '#a855f7', // fuchsia
      '#eab308', // yellow
    ];
    
    // Filter out already used colors
    const availableColors = colors.filter(color => !usedColors.includes(color));
    
    // If we've used all colors, start over with a slightly modified version
    if (availableColors.length === 0) {
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  };

  // Keep track of assigned colors for classes
  const [classColors, setClassColors] = useState<{ [key: string]: { bg: string; text: string } }>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('classColors');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return {};
  });

  // Save class colors to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(classColors).length > 0) {
      localStorage.setItem('classColors', JSON.stringify(classColors));
    }
  }, [classColors]);

  const getClassColor = (className: string) => {
    if (!classColors[className]) {
      // Get list of currently used colors
      const usedColors = Object.values(classColors).map(color => color.bg);
      const bgColor = generateRandomColor(usedColors);
      
      setClassColors(prev => ({
        ...prev,
        [className]: {
          bg: bgColor,
          text: '#ffffff'
        }
      }));
      return { bg: bgColor, text: '#ffffff' };
    }
    return classColors[className];
  };

  // Fetch tasks and calculate schedule
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.group('📅 Calendar Task Loading');
        console.log('Fetching tasks from API...');
        
        const response = await fetch('/api/tasks');
        const rawTasks = await response.json();
        console.log('Raw tasks from API:', rawTasks);
        
        setTasks(rawTasks);
        
        // Calculate schedule
        console.log('Calculating task schedule...');
        const scheduledTasks = calculateTaskSchedule(rawTasks);
        console.log('Scheduled tasks:', scheduledTasks);
        
        // Convert scheduled tasks to calendar events
        console.log('Converting tasks to calendar events...');
        const newEvents = scheduledTasks.map(task => {
          const startDate = new Date(task.date);
          const endDate = new Date(startDate.getTime() + task.duration * 60000);
          
          const classColors = task.originalTask.class 
            ? getClassColor(task.originalTask.class.name)
            : getClassColor('default');
          
          const event: CalendarEventData = {
            id: `${task.taskId}-${startDate.toISOString()}`,
            title: task.originalTask.title,
            start: startDate,
            end: endDate,
            backgroundColor: classColors.bg,
            textColor: classColors.text,
            extendedProps: {
              taskId: task.taskId,
              description: task.originalTask.description,
              priority: task.originalTask.priority,
              class: task.originalTask.class ? {
                name: task.originalTask.class.name,
                color: classColors.bg
              } : undefined,
              completed: task.completed
            }
          };
          
          console.log('Created event:', {
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            duration: task.duration,
            class: task.originalTask.class?.name,
            colors: classColors
          });
          
          return event;
        });
        
        console.log('Final calendar events:', newEvents);
        setEvents(newEvents);
        console.groupEnd();
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchTasks();
    }
  }, [session]);

  // Handle event click
  const handleEventClick = (info: EventClickArg) => {
    const task = tasks.find(t => t.id === info.event.extendedProps.taskId);
    if (task) {
      setSelectedTask(task);
      setShowTaskModal(true);
    }
  };

  // Handle date click
  const handleDateClick = (info: DateClickArg) => {
    setSelectedDate(info.date);
    setShowTaskModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: ''
              }}
              views={{
                dayGridMonth: {
                  titleFormat: { year: 'numeric', month: 'long' }
                },
                timeGridWeek: {
                  titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
                }
              }}
              events={events}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              height="auto"
              eventDisplay="block"
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: 'short'
              }}
              eventContent={(eventInfo) => (
                <div className="p-1 rounded">
                  <div className="font-medium truncate">{eventInfo.event.title}</div>
                  {eventInfo.event.extendedProps.class && (
                    <div className="text-sm opacity-90 truncate">
                      {eventInfo.event.extendedProps.class.name}
                    </div>
                  )}
                </div>
              )}
              dayMaxEvents={3}
              moreLinkContent={(args) => `+${args.num} more`}
              nowIndicator={true}
              weekends={true}
            />
          </div>
        </div>
      </div>

      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedTask ? 'Task Details' : 'Tasks for ' + selectedDate?.toLocaleDateString()}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTaskModal(false)}
              >
                ✕
              </Button>
            </div>
            
            {selectedTask ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Title</h3>
                  <p>{selectedTask.title}</p>
                </div>
                {selectedTask.description && (
                  <div>
                    <h3 className="font-medium">Description</h3>
                    <p>{selectedTask.description}</p>
                  </div>
                )}
                {selectedTask.class && (
                  <div>
                    <h3 className="font-medium">Class</h3>
                    <p>{selectedTask.class.name}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-medium">Due Date</h3>
                  <p>{new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-medium">Estimated Time</h3>
                  <p>{selectedTask.estimatedTime} hours</p>
                </div>
                <div>
                  <h3 className="font-medium">Priority</h3>
                  <p>{selectedTask.priority}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {events
                  .filter(event => 
                    event.start.toDateString() === selectedDate?.toDateString()
                  )
                  .map(event => (
                    <div
                      key={event.id}
                      className="p-2 rounded hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        const task = tasks.find(t => t.id === event.extendedProps.taskId);
                        if (task) {
                          setSelectedTask(task);
                        }
                      }}
                    >
                      <div className="font-medium">{event.title}</div>
                      {event.extendedProps.class && (
                        <div className="text-sm text-gray-500">
                          {event.extendedProps.class.name}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
} 