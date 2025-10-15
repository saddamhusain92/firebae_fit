'use client';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Target, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useAuth();
  
  // These would be fetched from Firestore in a real app
  const stats = {
    totalWorkouts: 28,
    caloriesBurned: 8400,
    goalsCompleted: 3,
    workoutsThisWeek: 3,
  };

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
          You’ve completed {stats.workoutsThisWeek} workouts this week — keep up the great work 💪.
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
              <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
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
              <div className="text-2xl font-bold">{stats.caloriesBurned.toLocaleString()}</div>
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
              <div className="text-2xl font-bold">+{stats.goalsCompleted}</div>
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
            <p className="text-muted-foreground">Your recent workouts will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
