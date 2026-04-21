import { Language } from './translations';

export type MoodState = 'distracted' | 'low-energy' | 'motivated' | 'anxious' | 'bored' | 'focused' | 'relapse-risk';

export interface Book {
  id: string;
  title: Record<Language, string> | string;
  author: Record<Language, string> | string;
  language: 'English' | 'Hindi';
  description: Record<Language, string>;
  moods: MoodState[];
  readingTime: Record<Language, string>;
  insight: Record<Language, string>;
  nextStep: Record<Language, string>;
  sourceUrl?: string;
  coverUrl?: string;
}

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
    title: { en: "Man's Search for Meaning", hi: "जीने की इच्छा" },
    author: { en: "Viktor Frankl", hi: "विक्टर फ्रैंकल" },
    language: 'English',
    description: { 
      en: "A powerful testament to the human spirit's ability to find purpose in the darkest times.",
      hi: "अंधेरे समय में उद्देश्य खोजने की मानवीय आत्मा की क्षमता का एक शक्तिशाली प्रमाण।"
    },
    moods: ['relapse-risk', 'anxious'],
    readingTime: { en: "Medium", hi: "मध्यम" },
    insight: { 
      en: "Between stimulus and response there is a space. In that space is our power to choose our response.",
      hi: "उत्तेजना और प्रतिक्रिया के बीच एक स्थान है। उस स्थान में हमारी प्रतिक्रिया चुनने की शक्ति है।"
    },
    nextStep: {
      en: "Pause for 60 seconds. Observe the urge without acting on it. Realize you are the observer, not the impulse.",
      hi: "60 सेकंड के लिए रुकें। उस पर कार्रवाई किए बिना इच्छा का निरीक्षण करें। महसूस करें कि आप निरीक्षक हैं, आवेग नहीं।"
    }
  },
  {
    id: '2',
    title: { en: "Identify the God Within", hi: "अपने भीतर बसे भगवान को पहचानें" },
    author: { en: "Pandit Shriram Sharma Acharya", hi: "पंडित श्रीराम शर्मा आचार्य" },
    language: 'Hindi',
    description: {
      en: "A spiritual guide to inner strength and identifying one's higher purpose.",
      hi: "आंतरिक शक्ति और अपने उच्च उद्देश्य की पहचान करने के लिए एक आध्यात्मिक मार्गदर्शिका।"
    },
    moods: ['relapse-risk', 'low-energy'],
    readingTime: { en: "Short", hi: "लघु" },
    insight: {
      en: "Inner strength comes from recognizing the divine spark within that is untainted by temporary desires.",
      hi: "आंतरिक शक्ति उस भीतर की दिव्य चिंगारी को पहचानने से आती है जो अस्थायी इच्छाओं से अछूती है।"
    },
    nextStep: {
      en: "Sit in silence for 5 minutes. Visualize a light at your center that remains calm even as waves of desire pass over it.",
      hi: "5 मिनट के लिए मौन में बैठें। अपने केंद्र में एक प्रकाश की कल्पना करें जो इच्छा की लहरों के गुजरने पर भी शांत रहता है।"
    }
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
      language: 'English',
      description: { 
        en: `Explore the core principles of ${subject.replace('_', ' ')} through this work.`,
        hi: `इस कार्य के माध्यम से ${subject.replace('_', ' ')} के मूल सिद्धांतों का अन्वेषण करें।`
      },
      moods: [mood],
      readingTime: { en: "Variable", hi: "परिवर्तनीय" },
      insight: {
        en: "This work offers a disciplined perspective on maintaining focus and building character.",
        hi: "यह कार्य फोकस बनाए रखने और चरित्र निर्माण पर एक अनुशासित दृष्टिकोण प्रदान करता है।"
      },
      nextStep: {
        en: "Analyze the foundational arguments in the first chapter to ground your current state.",
        hi: "अपनी वर्तमान स्थिति को स्थिर करने के लिए पहले अध्याय में मूलभूत तर्कों का विश्लेषण करें।"
      },
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
