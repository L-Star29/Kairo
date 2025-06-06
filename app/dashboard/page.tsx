"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { format, isToday, isTomorrow, parseISO } from "date-fns"
import { Calendar, Clock, BookOpen } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: number
  status: string
  estimatedTime: number
  class: {
    name: string
  }
}

interface Class {
  id: string
  name: string
  difficulty: number
  teacherName: string
  teacherStrictness: number
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, classesRes] = await Promise.all([
          fetch('/api/tasks'),
          fetch('/api/classes')
        ])
        
        const tasksData = await tasksRes.json()
        const classesData = await classesRes.json()
        
        setTasks(tasksData)
        setClasses(classesData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchData()
    }
  }, [session])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    redirect("/auth/signin")
  }

  const todayTasks = tasks.filter(task => isToday(parseISO(task.dueDate)))
  const upcomingTasks = tasks
    .filter(task => !isToday(parseISO(task.dueDate)))
    .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime())
    .slice(0, 3)

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg border-4 border-dashed border-gray-200 p-4">
              <h2 className="text-xl font-semibold mb-6">Welcome, {session?.user?.name}!</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                    <h3 className="text-lg font-medium">Today's Tasks</h3>
                  </div>
                  {todayTasks.length > 0 ? (
                    <ul className="space-y-3">
                      {todayTasks.map(task => (
                        <li key={task.id} className="flex items-start">
                          <div className="flex-1">
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-gray-600">{task.class.name}</p>
                          </div>
                          <span className="text-sm text-gray-500">{formatTime(task.estimatedTime)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No tasks scheduled for today.</p>
                  )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <Clock className="w-5 h-5 text-orange-500 mr-2" />
                    <h3 className="text-lg font-medium">Upcoming Deadlines</h3>
                  </div>
                  {upcomingTasks.length > 0 ? (
                    <ul className="space-y-3">
                      {upcomingTasks.map(task => (
                        <li key={task.id} className="flex items-start">
                          <div className="flex-1">
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-gray-600">
                              {isTomorrow(parseISO(task.dueDate)) 
                                ? 'Tomorrow' 
                                : format(parseISO(task.dueDate), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <span className="text-sm text-gray-500">{formatTime(task.estimatedTime)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No upcoming deadlines.</p>
                  )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <BookOpen className="w-5 h-5 text-green-500 mr-2" />
                    <h3 className="text-lg font-medium">Class Overview</h3>
                  </div>
                  {classes.length > 0 ? (
                    <ul className="space-y-3">
                      {classes.map(cls => (
                        <li key={cls.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{cls.name}</p>
                            <p className="text-sm text-gray-600">{cls.teacherName}</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500">
                              Difficulty: {cls.difficulty}/5
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No classes added yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 