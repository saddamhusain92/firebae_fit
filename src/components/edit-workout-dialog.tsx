'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';

const formSchema = z.object({
  exerciseName: z.string().min(1, 'Exercise name is required.'),
  sets: z.coerce.number().min(1, 'Sets must be greater than 0.'),
  reps: z.coerce.number().min(1, 'Reps must be greater than 0.'),
  duration: z.coerce.number().min(1, 'Duration must be greater than 0.'),
  caloriesBurned: z.coerce.number().min(1, 'Calories burned must be greater than 0.'),
});

export function EditWorkoutDialog({ workout }: { workout: any }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      exerciseName: '',
      sets: 0,
      reps: 0,
      duration: 0,
      caloriesBurned: 0,
    },
  });

  useEffect(() => {
    if (workout) {
      form.reset({
        exerciseName: workout.exerciseName,
        sets: workout.sets,
        reps: workout.reps,
        duration: workout.duration,
        caloriesBurned: workout.caloriesBurned,
      });
    }
  }, [workout, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to edit a workout.',
      });
      return;
    }
    if (!workout.id) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Workout ID is missing.',
          });
          return;
    }

    try {
      const workoutDoc = doc(firestore, 'users', user.uid, 'workouts', workout.id);
      await updateDocumentNonBlocking(workoutDoc, values);

      toast({
        title: 'Workout Updated!',
        description: 'Your workout has been successfully updated.',
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to update workout',
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Workout</DialogTitle>
          <DialogDescription>
            Update the details of your training session.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="exerciseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bench Press, Squats" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="sets"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Sets</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 3" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="reps"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Reps</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 10" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Duration (min)</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="caloriesBurned"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Calories Burned</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}