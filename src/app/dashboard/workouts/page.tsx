'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircle, Dumbbell, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data, this would come from Firestore
const workouts = [
  { id: '1', date: '2024-07-22', name: 'Chest Day', exercises: 5, duration: 60, calories: 450 },
  { id: '2', date: '2024-07-20', name: 'Leg Day', exercises: 6, duration: 75, calories: 600 },
  { id: '3', date: '2024-07-18', name: 'Back & Biceps', exercises: 7, duration: 65, calories: 500 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function WorkoutsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">My Workouts</h1>
          <p className="text-muted-foreground">Log, view, and manage your training sessions.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Workout
        </Button>
      </div>

      {workouts.length > 0 ? (
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {workouts.map(workout => (
            <motion.div key={workout.id} variants={itemVariants}>
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="font-headline">{workout.name}</CardTitle>
                      <CardDescription>{new Date(workout.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                    </div>
                    <Dumbbell className="h-8 w-8 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="font-semibold">{workout.exercises}</p>
                      <p className="text-muted-foreground">Exercises</p>
                    </div>
                    <div>
                      <p className="font-semibold">{workout.duration} min</p>
                      <p className="text-muted-foreground">Duration</p>
                    </div>
                    <div>
                      <p className="font-semibold">{workout.calories}</p>
                      <p className="text-muted-foreground">Calories</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">No workouts logged</h3>
            <p className="text-sm text-muted-foreground">Start by adding your first workout session.</p>
            <Button className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Workout
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
