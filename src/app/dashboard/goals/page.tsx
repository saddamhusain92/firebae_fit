'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Target } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data, this would come from Firestore
const goals = [
  { id: '1', name: 'Lose 10 lbs', target: 10, current: 4, unit: 'lbs' },
  { id: '2', name: 'Run a 5k', target: 5, current: 2.5, unit: 'km' },
  { id: '3', name: 'Workout 4 times a week', target: 4, current: 3, unit: 'sessions' },
  { id: '4', name: 'Hit new Bench Press PR', target: 225, current: 205, unit: 'lbs' },
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

export default function GoalsPage() {
  const getProgress = (current: number, target: number) => (current / target) * 100;

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Fitness Goals</h1>
          <p className="text-muted-foreground">Set targets and track your progress towards them.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Set New Goal
        </Button>
      </div>

      {goals.length > 0 ? (
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
                      <CardTitle className="font-headline">{goal.name}</CardTitle>
                      <CardDescription>Target: {goal.target} {goal.unit}</CardDescription>
                    </div>
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{goal.current} / {goal.target} {goal.unit}</p>
                    <p className="text-sm font-bold text-primary">{getProgress(goal.current, goal.target).toFixed(0)}%</p>
                  </div>
                  <Progress value={getProgress(goal.current, goal.target)} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">No goals set</h3>
            <p className="text-sm text-muted-foreground">Set your first fitness goal to get started.</p>
            <Button className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" /> Set New Goal
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
