"use client";

import { useState, useMemo, useEffect } from 'react';
import PortalSheet from "@/components/ui/portal-sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoodState, Book, getLocalRecommendations, fetchBooksByMood } from '@/lib/books';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Sparkles, 
  ChevronRight, 
  Zap, 
  Brain, 
  Heart, 
  AlertCircle, 
  Target, 
  Coffee,
  X,
  Languages,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

interface ClarityLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClarityLibrary({ isOpen, onClose }: ClarityLibraryProps) {
  const { t, language } = useLanguage();
  const [selectedMood, setSelectedMood] = useState<MoodState | null>(null);
  const [languageFilter, setLanguageFilter] = useState<'All' | 'English' | 'Hindi'>('All');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [apiBooks, setApiBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const MOODS: { id: MoodState; label: string; icon: any; color: string }[] = useMemo(() => [
    { id: 'relapse-risk', label: t('mood_struggling'), icon: AlertCircle, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
    { id: 'anxious', label: t('mood_anxious'), icon: Heart, color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
    { id: 'distracted', label: t('mood_distracted'), icon: Brain, color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
    { id: 'low-energy', label: t('mood_low_energy'), icon: Coffee, color: 'text-slate-400 bg-slate-400/10 border-slate-400/20' },
    { id: 'motivated', label: t('mood_motivated'), icon: Zap, color: 'text-primary bg-primary/10 border-primary/20' },
    { id: 'focused', label: t('mood_focused'), icon: Target, color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  ], [t]);

  useEffect(() => {
    if (selectedMood) {
      setIsLoading(true);
      setApiBooks([]);
      fetchBooksByMood(selectedMood).then(books => {
        setApiBooks(books);
        setIsLoading(false);
      });
    }
  }, [selectedMood]);

  const allBooks = useMemo(() => {
    if (!selectedMood) return [];
    const local = getLocalRecommendations(selectedMood);
    const combined = [...local, ...apiBooks];
    
    return combined.filter(book => {
      const langMatch = languageFilter === 'All' || book.language === languageFilter;
      return langMatch;
    });
  }, [selectedMood, apiBooks, languageFilter]);

  const handleClose = () => {
    setSelectedMood(null);
    setSelectedBook(null);
    onClose();
  };

  const getBookField = (field: any) => {
    if (typeof field === 'string') return field;
    return field[language] || field['en'];
  };

  return (
    <PortalSheet 
      isOpen={isOpen} 
      onClose={handleClose}
      title={selectedBook ? t('wisdom_detail') : t('clarity_hub')}
      description={selectedBook ? getBookField(selectedBook.title) : t('targeted_guidance')}
    >
      <AnimatePresence mode="wait">
        {selectedBook ? (
          <motion.div
            key="book-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 mb-2">
              <Button variant="ghost" size="icon" onClick={() => setSelectedBook(null)} className="rounded-full bg-white/5">
                <ArrowLeft size={18} />
              </Button>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold text-white truncate">{getBookField(selectedBook.title)}</h3>
                <p className="text-white/40 text-xs font-medium truncate">{getBookField(selectedBook.author)}</p>
              </div>
            </div>

            {selectedBook.coverUrl && (
              <div className="relative w-48 aspect-[2/3] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image 
                  src={selectedBook.coverUrl} 
                  alt={getBookField(selectedBook.title)} 
                  fill 
                  className="object-cover"
                />
              </div>
            )}

            <div className="space-y-6">
              <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('overview_text')}</h4>
                <p className="text-white/60 text-sm leading-relaxed font-medium">
                  {getBookField(selectedBook.description)}
                </p>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/20 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('core_insight')}</h4>
                </div>
                <p className="text-white/80 text-base font-bold leading-relaxed italic">
                  "{getBookField(selectedBook.insight)}"
                </p>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-green-500/5 border border-green-500/20 space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">{t('next_step')}</h4>
                </div>
                <p className="text-white/60 text-sm leading-relaxed font-medium">
                  {getBookField(selectedBook.nextStep)}
                </p>
              </div>
            </div>

            {selectedBook.sourceUrl && (
              <Button 
                onClick={() => window.open(selectedBook.sourceUrl, '_blank')}
                className="w-full h-18 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm gap-3 shadow-2xl"
              >
                <ExternalLink size={20} /> {t('open_source')}
              </Button>
            )}
          </motion.div>
        ) : !selectedMood ? (
          <motion.div 
            key="mood-selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <p className="text-white/60 text-center text-sm font-medium">{t('mood_question')}</p>
            <div className="grid grid-cols-2 gap-4">
              {MOODS.map((mood) => (
                <motion.button
                  key={mood.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMood(mood.id)}
                  className={cn(
                    "p-8 rounded-[2.5rem] border flex flex-col items-center gap-4 transition-all",
                    mood.color
                  )}
                >
                  <mood.icon size={32} />
                  <span className="text-xs font-bold text-white/80">{mood.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="book-list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between gap-4">
              <Button variant="ghost" size="sm" onClick={() => setSelectedMood(null)} className="h-10 px-4 rounded-xl bg-white/5 text-white/60 hover:text-white">
                <ArrowLeft size={16} className="mr-2" /> {t('change_state')}
              </Button>
              <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                {[t('lang_all'), t('lang_en'), t('lang_hi')].map((l, i) => {
                  const filters = ['All', 'English', 'Hindi'];
                  return (
                    <button
                      key={l}
                      onClick={() => setLanguageFilter(filters[i] as any)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all",
                        languageFilter === filters[i] ? "bg-primary text-white" : "text-white/30 hover:text-white/50"
                      )}
                    >
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {isLoading ? (
                <div className="py-20 flex flex-col items-center gap-4">
                  <RefreshCw size={32} className="text-primary animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{t('fetching_knowledge')}</p>
                </div>
              ) : (
                allBooks.map((book, idx) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedBook(book)}
                    className="group bg-white/[0.03] p-6 rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <div className="flex gap-4">
                      {book.coverUrl && (
                        <div className="relative w-16 h-24 rounded-lg overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform border border-white/10">
                          <Image src={book.coverUrl} alt={getBookField(book.title)} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">{getBookField(book.title)}</h4>
                        <p className="text-white/40 text-xs font-medium truncate mb-2">{getBookField(book.author)}</p>
                        <p className="text-white/50 text-[11px] leading-relaxed line-clamp-2 mb-3">
                          {getBookField(book.description)}
                        </p>
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase text-white/20">
                          <Languages size={12} className="text-primary/50" /> {book.language}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PortalSheet>
  );
}
