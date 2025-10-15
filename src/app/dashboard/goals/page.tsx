'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { AddGoalDialog } from '@/components/add-goal-dialog';

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

export default function GoalsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const goalsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'goals');
  }, [firestore, user]);

  const { data: goals, isLoading } = useCollection(goalsQuery);

  const getProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    return (current / target) * 100;
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Fitness Goals</h1>
          <p className="text-muted-foreground">Set targets and track your progress towards them.</p>
        </div>
        <AddGoalDialog />
      </div>

      {isLoading && <p>Loading goals...</p>}

      {!isLoading && goals && goals.length > 0 ? (
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {goals.map(goal => (
            <motion.div key={goal.id} variants={itemVariants}>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="font-headline">{goal.goalType}</CardTitle>
                      <CardDescription>Target: {goal.targetValue}</CardDescription>
                    </div>
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{goal.currentValue} / {goal.targetValue}</p>
                    <p className="text-sm font-bold text-primary">{getProgress(goal.currentValue, goal.targetValue).toFixed(0)}%</p>
                  </div>
                  <Progress value={getProgress(goal.currentValue, goal.targetValue)} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        !isLoading && (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[400px]">
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">No goals set</h3>
                    <p className="text-sm text-muted-foreground">Set your first fitness goal to get started.</p>
                    <div className="mt-4">
                        <AddGoalDialog />
                    </div>
                </div>
            </div>
        )
      )}
    </>
  );
}
