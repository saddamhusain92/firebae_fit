'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { motion } from 'framer-motion';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isWithinInterval, getWeek, startOfMonth, endOfMonth, parseISO } from 'date-fns';

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


export default function AnalyticsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const workoutsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'workouts');
  }, [firestore, user]);

  const { data: workouts, isLoading } = useCollection(workoutsQuery);

  const getWeeklyData = () => {
    if (!workouts) return [];
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start, end });

    const weeklyData = weekDays.map(day => ({
      day: format(day, 'E'),
      calories: 0,
    }));

    workouts.forEach(workout => {
      const workoutDate = parseISO(workout.date);
      if (isWithinInterval(workoutDate, { start, end })) {
        const dayOfWeek = format(workoutDate, 'E');
        const dayIndex = weeklyData.findIndex(d => d.day === dayOfWeek);
        if (dayIndex !== -1) {
          weeklyData[dayIndex].calories += workout.caloriesBurned;
        }
      }
    });

    return weeklyData;
  }

  const getMonthlyData = () => {
    if (!workouts) return [];
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);

    const weeklyWorkouts: { [week: number]: number } = {};

    workouts.forEach(workout => {
      const workoutDate = parseISO(workout.date);
      if (isWithinInterval(workoutDate, { start, end })) {
        const weekNumber = getWeek(workoutDate);
        if (!weeklyWorkouts[weekNumber]) {
          weeklyWorkouts[weekNumber] = 0;
        }
        weeklyWorkouts[weekNumber]++;
      }
    });

    return Object.entries(weeklyWorkouts).map(([week, count]) => ({
      week: `Week ${Object.keys(weeklyWorkouts).indexOf(week) + 1}`,
      workouts: count,
    }));
  };

  const weeklyData = getWeeklyData();
  const monthlyData = getMonthlyData();


  return (
    <>
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Visualize your hard work and progress over time.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Calories Burned</CardTitle>
              <CardDescription>Estimated calories burned in workouts this week.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{
                      background: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants} initial="hidden" animate="visible" style={{transitionDelay: '0.1s'}}>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Workout Frequency</CardTitle>
              <CardDescription>Number of workouts per week this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{
                      background: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Bar dataKey="workouts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
