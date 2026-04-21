
/**
 * @fileOverview Curated library of discipline and growth literature.
 */

export type MoodState = 'distracted' | 'low-energy' | 'motivated' | 'anxious' | 'bored' | 'focused' | 'relapse-risk';

export interface Book {
  id: string;
  title: string;
  author: string;
  language: 'English' | 'Hindi';
  description: string;
  moods: MoodState[];
  readingTime: string;
}

export const LIBRARY: Book[] = [
  // RELAPSE RISK - Grounding & Immediate Perspective
  {
    id: '1',
    title: 'Man\'s Search for Meaning',
    author: 'Viktor Frankl',
    language: 'English',
    description: 'A powerful testament to the human spirit\'s ability to find purpose in the darkest times.',
    moods: ['relapse-risk', 'anxious'],
    readingTime: 'Medium'
  },
  {
    id: '2',
    title: 'Apne Bhitar Base Bhagwan Ko Pehchane',
    author: 'Pandit Shriram Sharma Acharya',
    language: 'Hindi',
    description: 'A spiritual guide to inner strength and identifying one\'s higher purpose.',
    moods: ['relapse-risk', 'low-energy'],
    readingTime: 'Short'
  },
  // MOTIVATED - Advanced Discipline
  {
    id: '3',
    title: 'Can\'t Hurt Me',
    author: 'David Goggins',
    language: 'English',
    description: 'Master your mind and defy the odds with extreme mental toughness.',
    moods: ['motivated', 'low-energy'],
    readingTime: 'Long'
  },
  {
    id: '4',
    title: 'Ati Prabhavkari Logon Ki 7 Aadatein',
    author: 'Stephen Covey',
    language: 'Hindi',
    description: 'The definitive guide to personal effectiveness and character-based growth.',
    moods: ['motivated', 'focused'],
    readingTime: 'Long'
  },
  // ANXIOUS - Grounding & Peace
  {
    id: '5',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    language: 'English',
    description: 'Stoic wisdom on maintaining a calm mind amidst external chaos.',
    moods: ['anxious', 'distracted'],
    readingTime: 'Medium'
  },
  {
    id: '6',
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    language: 'English',
    description: 'A guide to spiritual enlightenment by staying present in the moment.',
    moods: ['anxious', 'distracted'],
    readingTime: 'Medium'
  },
  // FOCUSED - Productivity
  {
    id: '7',
    title: 'Deep Work',
    author: 'Cal Newport',
    language: 'English',
    description: 'Rules for focused success in a distracted world.',
    moods: ['focused', 'distracted'],
    readingTime: 'Medium'
  },
  {
    id: '8',
    title: 'Atomic Habits',
    author: 'James Clear',
    language: 'English',
    description: 'An easy & proven way to build good habits and break bad ones.',
    moods: ['focused', 'motivated', 'bored'],
    readingTime: 'Medium'
  },
  // LOW ENERGY - Inspiration
  {
    id: '9',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    language: 'English',
    description: 'A fable about following your dream and listening to your heart.',
    moods: ['low-energy', 'bored'],
    readingTime: 'Short'
  },
  {
    id: '10',
    title: 'Wings of Fire',
    author: 'A.P.J. Abdul Kalam',
    language: 'English',
    description: 'The inspiring autobiography of the former President of India.',
    moods: ['low-energy', 'motivated'],
    readingTime: 'Long'
  }
];

export function getRecommendations(mood: MoodState): Book[] {
  return LIBRARY.filter(book => book.moods.includes(mood));
}
