"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useRouter } from "next/navigation";

const classSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  difficulty: z.number().min(1).max(10),
  teacherName: z.string().min(1, "Teacher name is required"),
  teacherStrictness: z.number().min(1).max(10),
});

type ClassFormValues = z.infer<typeof classSchema>;

interface ClassFormProps {
  onClose: () => void;
  initialData?: ClassFormValues;
  classId?: string;
}

export function ClassForm({ onClose, initialData, classId }: ClassFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: initialData || {
      name: "",
      difficulty: 5,
      teacherName: "",
      teacherStrictness: 5,
    },
  });

  const onSubmit = async (data: ClassFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        classId ? `/api/classes/${classId}` : "/api/classes",
        {
          method: classId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            difficulty: data.difficulty,
            teacherName: data.teacherName,
            teacherStrictness: data.teacherStrictness,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to save class");
      }

      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error saving class:", error);
      alert(error instanceof Error ? error.message : "Failed to save class. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter class name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty (1-10)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                  <div className="text-sm text-muted-foreground">
                    Current value: {field.value}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teacherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teacher Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter teacher name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teacherStrictness"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teacher Strictness (1-10)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                  <div className="text-sm text-muted-foreground">
                    Current value: {field.value}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : classId ? "Update Class" : "Add Class"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 