'use server';
/**
 * @fileOverview AI-powered personalized exercise suggestions flow.
 *
 * - getPersonalizedExerciseSuggestions - A function that generates personalized workout suggestions for a user.
 * - PersonalizedExerciseSuggestionsInput - The input type for the getPersonalizedExerciseSuggestions function.
 * - PersonalizedExerciseSuggestionsOutput - The return type for the getPersonalizedExerciseSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedExerciseSuggestionsInputSchema = z.object({
  workoutHistory: z
    .string()
    .describe('The user workout history, as a JSON string.'),
  goals: z.string().describe('The user fitness goals, as a JSON string.'),
  fitnessLevel: z.string().describe('The user fitness level (beginner, intermediate, advanced).'),
});
export type PersonalizedExerciseSuggestionsInput = z.infer<
  typeof PersonalizedExerciseSuggestionsInputSchema
>;

const PersonalizedExerciseSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'A list of personalized workout suggestions, tailored to the user. Should be formatted as a JSON string.'
    ),
});
export type PersonalizedExerciseSuggestionsOutput = z.infer<
  typeof PersonalizedExerciseSuggestionsOutputSchema
>;

export async function getPersonalizedExerciseSuggestions(
  input: PersonalizedExerciseSuggestionsInput
): Promise<PersonalizedExerciseSuggestionsOutput> {
  return personalizedExerciseSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedExerciseSuggestionsPrompt',
  input: {schema: PersonalizedExerciseSuggestionsInputSchema},
  output: {schema: PersonalizedExerciseSuggestionsOutputSchema},
  prompt: `You are a personal trainer expert that provides personalized workout suggestions based on workout history, goals, and fitness level.

Workout History: {{{workoutHistory}}}
Goals: {{{goals}}}
Fitness Level: {{{fitnessLevel}}}

Based on this information, provide a list of personalized workout suggestions, tailored to the user. The response must be a JSON string.
`,
});

const personalizedExerciseSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizedExerciseSuggestionsFlow',
    inputSchema: PersonalizedExerciseSuggestionsInputSchema,
    outputSchema: PersonalizedExerciseSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
