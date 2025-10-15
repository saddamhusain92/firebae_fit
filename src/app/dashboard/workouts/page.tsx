'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircle, Dumbbell, Edit, Trash2, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { AddWorkoutDialog } from '@/components/add-workout-dialog';
import React, { useState } from 'react';
import { PomodoroTimer } from '@/components/pomodoro-timer';
import { EditWorkoutDialog } from '@/components/edit-workout-dialog';

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
  const { user } = useUser();
  const firestore = useFirestore();
  const [timerKey, setTimerKey] = useState(0);
  const [timerDuration, setTimerDuration] = useState(25);
  const [timerTitle, setTimerTitle] = useState('Workout Timer');

  const workoutsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'workouts');
  }, [firestore, user]);

  const { data: workouts, isLoading } = useCollection(workoutsQuery);

  const handleDelete = (workoutId: string) => {
    if (!user) return;
    const workoutDoc = doc(firestore, 'users', user.uid, 'workouts', workoutId);
    deleteDocumentNonBlocking(workoutDoc);
  };

  const handleStartWorkout = (duration: number, exerciseName: string) => {
    setTimerDuration(duration);
    setTimerTitle(exerciseName);
    setTimerKey(prevKey => prevKey + 1);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">My Workouts</h1>
          <p className="text-muted-foreground">Log, view, and manage your training sessions.</p>
        </div>
        <AddWorkoutDialog />
      </div>

      <PomodoroTimer key={timerKey} initialDuration={timerDuration} title={timerTitle} />

      {isLoading && <p>Loading workouts...</p>}

      {!isLoading && workouts && workouts.length > 0 ? (
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
                      <CardTitle className="font-headline">{workout.exerciseName}</CardTitle>
                      <CardDescription>{new Date(workout.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                    </div>
                    <Dumbbell className="h-8 w-8 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="font-semibold">{workout.sets}</p>
                      <p className="text-muted-foreground">Sets</p>
                    </div>
                    <div>
                      <p className="font-semibold">{workout.reps}</p>
                      <p className="text-muted-foreground">Reps</p>
                    </div>
                    <div>
                      <p className="font-semibold">{workout.duration} min</p>
                      <p className="text-muted-foreground">Duration</p>
                    </div>
                  </div>
                   <div className="text-sm mt-2">
                      <p className="font-semibold">{workout.caloriesBurned}</p>
                      <p className="text-muted-foreground">Calories Burned</p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleStartWorkout(workout.duration, workout.exerciseName)}>
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </Button>
                  <EditWorkoutDialog workout={workout} />
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(workout.id)}><Trash2 className="h-4 w-4" /></Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        !isLoading && (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[400px]">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">No workouts logged</h3>
              <p className="text-sm text-muted-foreground">Start by adding your first workout session.</p>
              <div className="mt-4">
                  <AddWorkoutDialog />
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}
