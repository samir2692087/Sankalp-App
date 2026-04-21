/**
 * @fileOverview Curated and dynamic library of discipline and growth literature.
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
  insight: string;
  nextStep: string;
  sourceUrl?: string;
  coverUrl?: string;
}

// Maps user moods to Open Library Subjects
const MOOD_SUBJECTS: Record<MoodState, string> = {
  'relapse-risk': 'self-help',
  'anxious': 'stoicism',
  'distracted': 'psychology',
  'low-energy': 'motivation',
  'motivated': 'success',
  'focused': 'discipline',
  'bored': 'philosophy',
};

export const LIBRARY: Book[] = [
  {
    id: '1',
    title: 'Man\'s Search for Meaning',
    author: 'Viktor Frankl',
    language: 'English',
    description: 'A powerful testament to the human spirit\'s ability to find purpose in the darkest times.',
    moods: ['relapse-risk', 'anxious'],
    readingTime: 'Medium',
    insight: 'Between stimulus and response there is a space. In that space is our power to choose our response.',
    nextStep: 'Pause for 60 seconds. Observe the urge without acting on it. Realize you are the observer, not the impulse.'
  },
  {
    id: '2',
    title: 'Apne Bhitar Base Bhagwan Ko Pehchane',
    author: 'Pandit Shriram Sharma Acharya',
    language: 'Hindi',
    description: 'A spiritual guide to inner strength and identifying one\'s higher purpose.',
    moods: ['relapse-risk', 'low-energy'],
    readingTime: 'Short',
    insight: 'Inner strength comes from recognizing the divine spark within that is untainted by temporary desires.',
    nextStep: 'Sit in silence for 5 minutes. Visualize a light at your center that remains calm even as waves of desire pass over it.'
  },
  {
    id: '3',
    title: 'Can\'t Hurt Me',
    author: 'David Goggins',
    language: 'English',
    description: 'Master your mind and defy the odds with extreme mental toughness.',
    moods: ['motivated', 'low-energy'],
    readingTime: 'Long',
    insight: 'The 40% Rule: When your mind tells you that you are done, you are only at 40% of your potential.',
    nextStep: 'Do one difficult task right now that you were planning to skip. Push past the initial "no" of your mind.'
  }
];

export async function fetchBooksByMood(mood: MoodState): Promise<Book[]> {
  const subject = MOOD_SUBJECTS[mood] || 'self_help';
  const url = `https://openlibrary.org/subjects/${subject}.json?limit=12`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    if (!data.works) return [];

    return data.works.map((work: any) => ({
      id: work.key,
      title: work.title,
      author: work.authors && work.authors.length > 0 ? work.authors[0].name : 'Various Authors',
      language: 'English', // Subjects API usually returns English metadata
      description: `Explore the core principles of ${subject.replace('_', ' ')} through this work.`,
      moods: [mood],
      readingTime: 'Variable',
      insight: "This work offers a disciplined perspective on maintaining focus and building character.",
      nextStep: "Analyze the foundational arguments in the first chapter to ground your current state.",
      sourceUrl: `https://openlibrary.org${work.key}`,
      coverUrl: work.cover_id ? `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg` : undefined
    }));
  } catch (error) {
    console.error('Error fetching from Open Library Subjects:', error);
    return [];
  }
}

export function getLocalRecommendations(mood: MoodState): Book[] {
  return LIBRARY.filter(book => book.moods.includes(mood));
}
