"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ClassForm } from "@/components/classes/class-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Class = {
  id: string;
  name: string;
  difficulty: number;
  teacherName: string;
  teacherStrictness: number;
};

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/classes");
      if (!response.ok) throw new Error("Failed to fetch classes");
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      alert("Failed to fetch classes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      const response = await fetch(`/api/classes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete class");
      fetchClasses();
    } catch (error) {
      console.error("Error deleting class:", error);
      alert("Failed to delete class");
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Classes</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add New Class</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{classItem.name}</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Difficulty: {classItem.difficulty}/5</p>
              <p>Teacher: {classItem.teacherName}</p>
              <p>Teacher Strictness: {classItem.teacherStrictness}/5</p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(classItem.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
          </DialogHeader>
          <ClassForm onClose={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
} 