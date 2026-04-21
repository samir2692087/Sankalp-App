import { Language } from './translations';

export interface JourneyPhase {
  id: string;
  name: Record<Language, string>;
  range: [number, number]; // [minDays, maxDays]
  mentalState: Record<Language, string>;
  physicalState: Record<Language, string>;
  challenges: Record<Language, string>;
  guidance: Record<Language, string>;
  message: Record<Language, string>;
}

export const JOURNEY_PHASES: JourneyPhase[] = [
  {
    id: 'reset',
    name: { en: 'Reset', hi: 'रीसेट' },
    range: [0, 7],
    mentalState: { en: 'High anxiety, strong impulses.', hi: 'उच्च चिंता, मजबूत आवेग।' },
    physicalState: { en: 'Restless, low energy.', hi: 'बेचैनी, कम ऊर्जा।' },
    challenges: { en: 'Breaking the loop.', hi: 'चक्र तोड़ना।' },
    guidance: { en: 'Stay away from triggers. Use cold water or deep breathing.', hi: 'ट्रिगर्स से दूर रहें। ठंडे पानी या गहरी सांसों का उपयोग करें।' },
    message: { en: 'Weather the storm. This is the hardest part.', hi: 'तूफान का सामना करें। यह सबसे कठिन हिस्सा है।' }
  },
  {
    id: 'stabilization',
    name: { en: 'Stabilization', hi: 'स्थिरीकरण' },
    range: [7, 30],
    mentalState: { en: 'Clarity returns, mood swings possible.', hi: 'स्पष्टता लौटती है, मूड में उतार-चढ़ाव संभव है।' },
    physicalState: { en: 'Improved sleep, energy stabilizes.', hi: 'नींद में सुधार, ऊर्जा स्थिर होती है।' },
    challenges: { en: 'Boredom and flatline.', hi: 'ऊब और सुस्ती।' },
    guidance: { en: 'Routine is your primary foundation. Stay steady.', hi: 'दिनचर्या आपकी प्राथमिक नींव है। स्थिर रहें।' },
    message: { en: 'Foundations are being laid. Keep building.', hi: 'नींव रखी जा रही है। निर्माण जारी रखें।' }
  },
  {
    id: 'growth',
    name: { en: 'Growth', hi: 'विकास' },
    range: [30, 60],
    mentalState: { en: 'Confidence spikes, focus improves.', hi: 'आत्मविश्वास बढ़ता है, फोकस में सुधार होता है।' },
    physicalState: { en: 'Increased vitality and recovery.', hi: 'बढ़ी हुई जीवन शक्ति और सुधार।' },
    challenges: { en: 'Overconfidence traps.', hi: 'अति-आत्मविश्वास का जाल।' },
    guidance: { en: 'Channel your new energy into a difficult hobby or training.', hi: 'अपनी नई ऊर्जा को किसी कठिन शौक या प्रशिक्षण में लगाएं।' },
    message: { en: 'Your potential is waking up. Direct it.', hi: 'आपकी क्षमता जाग रही है। इसे सही दिशा दें।' }
  },
  {
    id: 'control',
    name: { en: 'Control', hi: 'नियंत्रण' },
    range: [60, 90],
    mentalState: { en: 'Calm presence, mastery over impulses.', hi: 'शांत उपस्थिति, आवेगों पर महारत।' },
    physicalState: { en: 'Sustained energy levels.', hi: 'निरंतर ऊर्जा स्तर।' },
    challenges: { en: 'Stagnation risks.', hi: 'ठहराव का जोखिम।' },
    guidance: { en: 'Discipline is not a restriction; it is freedom.', hi: 'अनुशासन कोई प्रतिबंध नहीं है; यह स्वतंत्रता है।' },
    message: { en: 'Control is becoming your default state.', hi: 'नियंत्रण आपकी डिफ़ॉल्ट स्थिति बन रहा है।' }
  },
  {
    id: 'mastery',
    name: { en: 'Mastery', hi: 'महारत' },
    range: [90, 365],
    mentalState: { en: 'Absolute clarity and inner peace.', hi: 'पूर्ण स्पष्टता और आंतरिक शांति।' },
    physicalState: { en: 'Embodiment of health.', hi: 'स्वास्थ्य का साकार रूप।' },
    challenges: { en: 'Maintaining standards.', hi: 'मानकों को बनाए रखना।' },
    guidance: { en: 'Help others start. Your path now serves as a light.', hi: 'दूसरों को शुरू करने में मदद करें। आपका रास्ता अब एक प्रकाश का काम करता है।' },
    message: { en: 'A year of choice. A lifetime of freedom.', hi: 'चुनाव का एक वर्ष। स्वतंत्रता का एक जीवन भर।' }
  }
];

export function getJourneyPhase(days: number): JourneyPhase {
  return JOURNEY_PHASES.find(p => days >= p.range[0] && days < p.range[1]) || JOURNEY_PHASES[JOURNEY_PHASES.length - 1];
}
