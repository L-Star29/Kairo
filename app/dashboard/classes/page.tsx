"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassForm } from "@/components/classes/class-form";
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

interface Class {
  id: string;
  name: string;
  difficulty: number;
  teacherName: string;
  teacherStrictness: number;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [deletingClass, setDeletingClass] = useState<Class | null>(null);
  const [showClassForm, setShowClassForm] = useState(false);
  const [deletingClassId, setDeletingClassId] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  async function fetchClasses() {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/classes");
      if (!response.ok) throw new Error("Failed to fetch classes");
      const data = await response.json();
      setClasses(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setClasses([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEdit = (classData: Class) => {
    setEditingClass(classData);
    setShowClassForm(true);
  };

  const handleClassFormClose = () => {
    setShowClassForm(false);
    setEditingClass(null);
    fetchClasses();
  };

  const handleDelete = async (classId: string) => {
    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete class");
      }

      fetchClasses();
      setDeletingClassId(null);
    } catch (error) {
      console.error("Error deleting class:", error);
      alert("Failed to delete class. Please try again.");
    }
  };

  if (isLoading) {
    return <div>Loading classes...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Classes</h1>
        <Button onClick={() => setShowClassForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Class
        </Button>
      </div>

      {showClassForm && (
        <div className="mb-6 p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">
            {editingClass ? "Edit Class" : "Add New Class"}
          </h2>
          <ClassForm
            onClose={handleClassFormClose}
            initialData={editingClass || undefined}
            classId={editingClass?.id}
          />
        </div>
      )}

      {classes.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No classes yet. Add your first class!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((classItem) => (
            <div
              key={classItem.id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{classItem.name}</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(classItem)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingClass(classItem)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Difficulty: {classItem.difficulty}/10
              </p>
              <p className="text-sm text-muted-foreground">
                Teacher: {classItem.teacherName}
              </p>
              <p className="text-sm text-muted-foreground">
                Strictness: {classItem.teacherStrictness}/10
              </p>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deletingClass} onOpenChange={() => setDeletingClass(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the class and all associated tasks.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingClass) {
                  handleDelete(deletingClass.id);
                  setDeletingClass(null);
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