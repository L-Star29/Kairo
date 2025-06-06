"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, LayoutDashboard, BookOpen, CheckSquare } from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/calendar",
      label: "Calendar",
      icon: Calendar,
      active: pathname === "/dashboard/calendar",
    },
    {
      href: "/dashboard/classes",
      label: "Classes",
      icon: BookOpen,
      active: pathname === "/dashboard/classes",
    },
    {
      href: "/dashboard/tasks",
      label: "Tasks",
      icon: CheckSquare,
      active: pathname === "/dashboard/tasks",
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          <Button
            variant={route.active ? "secondary" : "ghost"}
            className="flex items-center gap-2"
          >
            <route.icon className="h-4 w-4" />
            {route.label}
          </Button>
        </Link>
      ))}
    </nav>
  )
} 