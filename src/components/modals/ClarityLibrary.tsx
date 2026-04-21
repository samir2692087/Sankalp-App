"use client";

import { useState, useMemo, useEffect } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from "@/components/ui/sheet";
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
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [apiBooks, setApiBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleOpenSource = (url?: string) => {
    if (url) window.open(url, '_blank');
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-[3rem] p-0 border-t border-white/5 bg-[#07070a] backdrop-blur-3xl outline-none flex flex-col overflow-hidden">
        <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mt-4 shrink-0" />
        
        <SheetHeader className="px-8 pt-6 pb-2 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={selectedBook ? () => setSelectedBook(null) : selectedMood ? () => setSelectedMood(null) : handleClose} 
                className="rounded-full text-white/40"
              >
                {selectedBook || selectedMood ? <ArrowLeft size={20} /> : <BookOpen size={24} className="text-primary" />}
              </Button>
              <div className="text-left">
                <SheetTitle className="text-2xl font-bold text-white tracking-tight">
                  {selectedBook ? "Wisdom Detail" : "Clarity Library"}
                </SheetTitle>
                <SheetDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                  {selectedBook ? selectedBook.title : "Targeted Guidance"}
                </SheetDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full text-white/40">
              <X size={20} />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6 no-scrollbar">
          <AnimatePresence mode="wait">
            {selectedBook ? (
              <motion.div
                key="book-detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 pb-12"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-3xl font-bold text-white leading-tight">{selectedBook.title}</h3>
                      <p className="text-white/40 text-sm font-medium">{selectedBook.author}</p>
                    </div>
                    <Badge variant="outline" className="border-primary/30 text-primary text-[10px] font-black uppercase px-3 py-1">
                      {selectedBook.readingTime}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/20 tracking-widest">
                      <Languages size={14} className="text-primary/50" />
                      {selectedBook.language}
                    </div>
                  </div>
                </div>

                {selectedBook.coverUrl && (
                  <div className="relative w-full aspect-[2/3] max-w-[200px] mx-auto rounded-2xl overflow-hidden shadow-2xl">
                    <Image 
                      src={selectedBook.coverUrl} 
                      alt={selectedBook.title} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="space-y-6">
                  <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Overview</h4>
                    <p className="text-white/60 text-sm leading-relaxed font-medium">
                      {selectedBook.description}
                    </p>
                  </div>

                  <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/20 space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-primary" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Core Insight</h4>
                    </div>
                    <p className="text-white/80 text-base font-bold leading-relaxed italic">
                      "{selectedBook.insight}"
                    </p>
                  </div>

                  <div className="p-8 rounded-[2.5rem] bg-green-500/5 border border-green-500/20 space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-green-500" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">Next Step</h4>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed font-medium">
                      {selectedBook.nextStep}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {selectedBook.sourceUrl && (
                    <Button 
                      onClick={() => handleOpenSource(selectedBook.sourceUrl)}
                      className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm gap-2"
                    >
                      <ExternalLink size={18} /> Open Source in Library
                    </Button>
                  )}
                  <Button 
                    onClick={() => setSelectedBook(null)}
                    className="w-full h-16 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold text-sm border border-white/5"
                  >
                    Return to Results
                  </Button>
                </div>
              </motion.div>
            ) : !selectedMood ? (
              <motion.div 
                key="mood-selector"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2 mb-8">
                  <p className="text-white/60 text-sm font-medium">How are you feeling right now?</p>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Select a state for targeted wisdom</p>
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
              <motion.div 
                key="book-list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
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
                  <span className="text-white/20 text-[10px] font-bold uppercase">
                    {isLoading ? "Fetching knowledge..." : `${allBooks.length} Recommendations`}
                  </span>
                </div>

                <div className="flex flex-col gap-4 pb-20">
                  {isLoading ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                      <RefreshCw size={32} className="text-primary animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Scanning Open Library...</p>
                    </div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {allBooks.map((book, idx) => (
                        <motion.div
                          key={book.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group glass-card p-6 rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all"
                        >
                          <div className="flex gap-4">
                            {book.coverUrl && (
                              <div className="relative w-16 h-24 rounded-lg overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                                <Image src={book.coverUrl} alt={book.title} fill className="object-cover" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-2">
                                <div className="space-y-1 min-w-0">
                                  <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">{book.title}</h4>
                                  <p className="text-white/40 text-xs font-medium truncate">{book.author}</p>
                                </div>
                              </div>
                              <p className="text-white/50 text-xs leading-relaxed mb-4 font-medium line-clamp-2">
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
                                  onClick={() => setSelectedBook(book)}
                                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 rounded-lg group"
                                >
                                  Explore <ChevronRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}

                  {!isLoading && allBooks.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                        <Sparkles size={24} className="text-white/20" />
                      </div>
                      <p className="text-white/40 text-sm font-medium">No matches found for this preference.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-[#0b0b0f] border-t border-white/5 px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">
            <Sparkles size={12} className="text-amber-500/50" /> Intelligence Hub Active
          </div>
          <div className="text-[9px] font-black uppercase text-white/10 tracking-widest">
            Knowledge Maintained
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
