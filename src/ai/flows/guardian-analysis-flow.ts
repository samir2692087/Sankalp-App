
'use server';
/**
 * @fileOverview AI Guardian flow for real-time safety analysis of browsing behavior.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GuardianInputSchema = z.object({
  content: z.string().describe('The URL or search query to analyze.'),
  userStreak: z.number().describe('The current mastery streak of the user.'),
});

const GuardianOutputSchema = z.object({
  safetyScore: z.number().min(0).max(100).describe('Safety score where 100 is perfectly safe.'),
  isSafe: z.boolean().describe('Whether the content is safe to access.'),
  riskCategory: z.enum(['NONE', 'MILD', 'MODERATE', 'CRITICAL']).describe('Categorization of the risk.'),
  recommendation: z.string().describe('Motivational guidance or reason for block.'),
});

export async function analyzeSafety(input: z.infer<typeof GuardianInputSchema>) {
  return guardianAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'guardianAnalysisPrompt',
  input: { schema: GuardianInputSchema },
  output: { schema: GuardianOutputSchema },
  prompt: `You are the AI Guardian for IronWill, a discipline mastery app.
Your job is to analyze the following user input (search query or URL) and determine if it poses a risk to their discipline (specifically regarding adult content, gambling, or heavy distractions).

User Streak: {{userStreak}} days
Input Content: {{{content}}}

Consider the user's streak. Users on low streaks are more vulnerable.
If the content is related to educational growth, productivity, or mastery, mark it as safe.
If it is a "gray area" distraction (e.g., social media infinite scroll), mark it as MODERATE risk.
If it is explicit or harmful, mark it as CRITICAL and isSafe = false.

Return a JSON object matching the schema.`,
});

const guardianAnalysisFlow = ai.defineFlow(
  {
    name: 'guardianAnalysisFlow',
    inputSchema: GuardianInputSchema,
    outputSchema: GuardianOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
