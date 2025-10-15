'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Loader2, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// This would call the Genkit flow
async function getSuggestions() {
  return new Promise(resolve => setTimeout(() => {
    resolve([
      { title: 'Dynamic Warm-up', description: 'Focus on mobility with leg swings, arm circles, and torso twists for 10 minutes.' },
      { title: 'Pyramid Bench Press', description: 'Increase weight and decrease reps for 5 sets (12, 10, 8, 6, 4 reps), then reverse.' },
      { title: 'Cardio Finisher', description: 'End with a 15-minute HIIT session on the treadmill: 1 min sprint, 2 min walk.' },
      { title: 'Core Strength Circuit', description: '3 rounds of: 1 min plank, 20 leg raises, 15 Russian twists.' },
    ]);
  }, 2000));
}

export default function SuggestionsPage() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await getSuggestions() as any[];
    setSuggestions(result);
    setLoading(false);
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
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">AI Suggestions</h1>
          <p className="text-muted-foreground">Get personalized workout suggestions based on your data.</p>
        </div>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generate Suggestions
        </Button>
      </div>

      <div className="flex-1">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 text-center py-12">
            <BrainCircuit className="h-16 w-16 text-primary animate-pulse" />
            <h3 className="text-xl font-bold tracking-tight">Generating your plan...</h3>
            <p className="text-sm text-muted-foreground max-w-sm">Our AI is analyzing your profile, goals, and history to create the perfect workout suggestions for you.</p>
          </div>
        )}

        <AnimatePresence>
          {!loading && suggestions.length > 0 && (
            <motion.div
              className="grid gap-4 md:grid-cols-2 mt-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {suggestions.map((suggestion, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{suggestion.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{suggestion.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && suggestions.length === 0 && (
           <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm mt-6 min-h-[400px]">
            <div className="flex flex-col items-center gap-2 text-center">
              <BrainCircuit className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-2xl font-bold tracking-tight">Ready for a challenge?</h3>
              <p className="text-sm text-muted-foreground">Click "Generate Suggestions" to get a workout plan tailored just for you.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
