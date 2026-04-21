/**
 * @fileOverview Curated library of discipline and growth literature.
 */

export type MoodState = 'distracted' | 'low-energy' | 'motivated' | 'anxious' | 'bored' | 'focused' | 'relapse-risk' | 'relapse-risk' | 'anxious' | 'distracted' | 'low-energy' | 'motivated' | 'focused';

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
  // MOTIVATED - Advanced Discipline
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
  },
  {
    id: '4',
    title: 'Ati Prabhavkari Logon Ki 7 Aadatein',
    author: 'Stephen Covey',
    language: 'Hindi',
    description: 'The definitive guide to personal effectiveness and character-based growth.',
    moods: ['motivated', 'focused'],
    readingTime: 'Long',
    insight: 'Be Proactive: Your life doesn\'t just happen. Whether you know it or not, it is designed by you.',
    nextStep: 'Identify one area where you are reacting. Choose a proactive response instead of a reactive one.'
  },
  // ANXIOUS - Grounding & Peace
  {
    id: '5',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    language: 'English',
    description: 'Stoic wisdom on maintaining a calm mind amidst external chaos.',
    moods: ['anxious', 'distracted'],
    readingTime: 'Medium',
    insight: 'You have power over your mind - not outside events. Realize this, and you will find strength.',
    nextStep: 'List three things causing you anxiety. Cross out the ones you cannot control. Focus only on the remaining one.'
  },
  {
    id: '6',
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    language: 'English',
    description: 'A guide to spiritual enlightenment by staying present in the moment.',
    moods: ['anxious', 'distracted'],
    readingTime: 'Medium',
    insight: 'Most human suffering is unnecessary. It is self-created as long as the unobserved mind runs your life.',
    nextStep: 'Bring your full attention to your breath. Feel the sensation of the air entering and leaving your body for 2 minutes.'
  },
  // FOCUSED - Productivity
  {
    id: '7',
    title: 'Deep Work',
    author: 'Cal Newport',
    language: 'English',
    description: 'Rules for focused success in a distracted world.',
    moods: ['focused', 'distracted'],
    readingTime: 'Medium',
    insight: 'Focus is a muscle. If you allow yourself to be constantly distracted, you lose the ability to focus deeply.',
    nextStep: 'Turn off all notifications for the next 60 minutes and complete your most important task.'
  },
  {
    id: '8',
    title: 'Atomic Habits',
    author: 'James Clear',
    language: 'English',
    description: 'An easy & proven way to build good habits and break bad ones.',
    moods: ['focused', 'motivated', 'bored'],
    readingTime: 'Medium',
    insight: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    nextStep: 'Identify one 2-minute habit you can start today that leads toward your primary goal.'
  },
  // LOW ENERGY - Inspiration
  {
    id: '9',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    language: 'English',
    description: 'A fable about following your dream and listening to your heart.',
    moods: ['low-energy', 'bored'],
    readingTime: 'Short',
    insight: 'When you want something, all the universe conspires in helping you to achieve it.',
    nextStep: 'Take one small step toward a dream you\'ve set aside. The first step is the most important.'
  },
  {
    id: '10',
    title: 'Wings of Fire',
    author: 'A.P.J. Abdul Kalam',
    language: 'English',
    description: 'The inspiring autobiography of the former President of India.',
    moods: ['low-energy', 'motivated'],
    readingTime: 'Long',
    insight: 'Failure will never overtake me if my determination to succeed is strong enough.',
    nextStep: 'Reflect on a recent failure. Write down one lesson learned and how it makes you stronger.'
  }
];

export function getRecommendations(mood: MoodState): Book[] {
  return LIBRARY.filter(book => book.moods.includes(mood));
}
