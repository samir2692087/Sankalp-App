
"use client";

import { useState, useMemo } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LIBRARY, MoodState, Book } from '@/lib/books';
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
  Languages
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClarityLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOODS: { id: MoodState; label: string; icon: any; color: string }[] = [
  { id: 'relapse-risk', label: 'Struggling', icon: AlertCircle, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
  { id: 'anxious', label: 'Anxious', icon: Heart, color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  { id: 'distracted', label: 'Distracted', icon: Brain, color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  { id: 'low-energy', label: 'Low Energy', icon: Coffee, color: 'text-slate-400 bg-slate-400/10 border-slate-400/20' },
  { id: 'motivated', label: 'Motivated', icon: Zap, color: 'text-primary bg-primary/10 border-primary/20' },
  { id: 'focused', label: 'Focused', icon: Target, color: 'text-green-400 bg-green-400/10 border-green-400/20' },
];

export default function ClarityLibrary({ isOpen, onClose }: ClarityLibraryProps) {
  const [selectedMood, setSelectedMood] = useState<MoodState | null>(null);
  const [languageFilter, setLanguageFilter] = useState<'All' | 'English' | 'Hindi'>('All');

  const filteredBooks = useMemo(() => {
    if (!selectedMood) return [];
    return LIBRARY.filter(book => {
      const moodMatch = book.moods.includes(selectedMood);
      const langMatch = languageFilter === 'All' || book.language === languageFilter;
      return moodMatch && langMatch;
    });
  }, [selectedMood, languageFilter]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-[3rem] p-0 border-t border-white/5 bg-[#07070a] backdrop-blur-3xl outline-none flex flex-col overflow-hidden">
        <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mt-4 shrink-0" />
        
        <SheetHeader className="px-8 pt-6 pb-2 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center border border-primary/20">
                <BookOpen size={24} />
              </div>
              <div className="text-left">
                <SheetTitle className="text-2xl font-bold text-white tracking-tight">Clarity Library</SheetTitle>
                <SheetDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Targeted Wisdom</SheetDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-white/40">
              <X size={20} />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6 no-scrollbar">
          {!selectedMood ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2 mb-8">
                <p className="text-white/60 text-sm font-medium">How are you feeling right now?</p>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Select a state for the right guidance</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {MOODS.map((mood) => (
                  <motion.button
                    key={mood.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMood(mood.id)}
                    className={cn(
                      "p-6 rounded-[2rem] border flex flex-col items-center gap-3 transition-all",
                      mood.color
                    )}
                  >
                    <mood.icon size={28} />
                    <span className="text-xs font-bold text-white/80">{mood.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedMood(null)}
                  className="h-10 px-4 rounded-xl bg-white/5 text-white/60 hover:text-white"
                >
                  Change State
                </Button>
                
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                  {['All', 'English', 'Hindi'].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLanguageFilter(l as any)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                        languageFilter === l ? "bg-primary text-white" : "text-white/30 hover:text-white/50"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", MOODS.find(m => m.id === selectedMood)?.color)}>
                  {MOODS.find(m => m.id === selectedMood)?.label}
                </div>
                <span className="text-white/20 text-[10px] font-bold uppercase">{filteredBooks.length} Recommendations</span>
              </div>

              <div className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredBooks.map((book, idx) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group glass-card p-6 rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{book.title}</h4>
                          <p className="text-white/40 text-xs font-medium">{book.author}</p>
                        </div>
                        <Badge variant="outline" className="border-white/10 text-[9px] text-white/30 font-bold uppercase px-2 py-0.5">
                          {book.readingTime}
                        </Badge>
                      </div>
                      
                      <p className="text-white/50 text-xs leading-relaxed mb-6 font-medium">
                        {book.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase text-white/20 tracking-tighter">
                          <Languages size={12} className="text-primary/50" />
                          {book.language}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 rounded-lg group"
                        >
                          Explore <ChevronRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredBooks.length === 0 && (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                      <Sparkles size={24} className="text-white/20" />
                    </div>
                    <p className="text-white/40 text-sm font-medium">No matches found for this preference.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#0b0b0f] border-t border-white/5 px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">
            <Sparkles size={12} className="text-amber-500/50" /> Curated Wisdom Matrix
          </div>
          <div className="text-[9px] font-black uppercase text-white/10 tracking-widest">
            Clarity Active
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
