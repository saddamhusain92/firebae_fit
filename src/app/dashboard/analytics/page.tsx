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

const weeklyData = [
  { day: 'Mon', calories: 350 },
  { day: 'Tue', calories: 0 },
  { day: 'Wed', calories: 500 },
  { day: 'Thu', calories: 0 },
  { day: 'Fri', calories: 600 },
  { day: 'Sat', calories: 200 },
  { day: 'Sun', calories: 0 },
];

const monthlyData = [
    { week: 'Week 1', workouts: 3 },
    { week: 'Week 2', workouts: 4 },
    { week: 'Week 3', workouts: 2 },
    { week: 'Week 4', workouts: 3 },
];

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
