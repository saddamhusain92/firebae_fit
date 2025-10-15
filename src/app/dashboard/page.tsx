'use client';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Target, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { collection } from 'firebase/firestore';
import { startOfWeek, isWithinInterval, parseISO } from 'date-fns';

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const workoutsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'workouts');
  }, [firestore, user]);

  const goalsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'goals');
  }, [firestore, user]);

  const { data: workouts, isLoading: isLoadingWorkouts } = useCollection(workoutsQuery);
  const { data: goals, isLoading: isLoadingGoals } = useCollection(goalsQuery);

  const stats = useMemoFirebase(() => {
    const today = new Date();
    const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
    
    const workoutsThisWeek = workouts?.filter(workout => {
        const workoutDate = parseISO(workout.date);
        return isWithinInterval(workoutDate, { start: startOfThisWeek, end: today });
    }).length || 0;

    const totalWorkouts = workouts?.length || 0;
    const caloriesBurned = workouts?.reduce((acc, workout) => acc + (workout.caloriesBurned || 0), 0) || 0;
    const goalsCompleted = goals?.filter(goal => goal.currentValue >= goal.targetValue).length || 0;

    return {
      totalWorkouts,
      caloriesBurned,
      goalsCompleted,
      workoutsThisWeek,
    };
  }, [workouts, goals]);


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
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={itemVariants}>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Welcome back, {user?.displayName?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          You’ve completed {stats.workoutsThisWeek} workout{stats.workoutsThisWeek === 1 ? '' : 's'} this week — keep up the great work 💪.
        </p>
      </motion.div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoadingWorkouts ? '...' : stats.totalWorkouts}</div>
              <p className="text-xs text-muted-foreground">All-time recorded workouts</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoadingWorkouts ? '...' : stats.caloriesBurned.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Estimated total calories</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goals Completed</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{isLoadingGoals ? '...' : stats.goalsCompleted}</div>
              <p className="text-xs text-muted-foreground">Achieved fitness goals</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingWorkouts ? (
                <p>Loading recent activity...</p>
            ) : workouts && workouts.length > 0 ? (
                <ul className="space-y-2">
                    {workouts.slice(0, 5).map(workout => (
                        <li key={workout.id} className="text-sm text-muted-foreground">
                            You logged a workout for <span className="font-semibold text-foreground">{workout.exerciseName}</span> on {new Date(workout.date).toLocaleDateString()}.
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground">Your recent workouts will be displayed here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
