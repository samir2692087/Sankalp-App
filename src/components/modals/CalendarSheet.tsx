"use client";

import { useState, useCallback, useRef, useMemo } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { UserData } from "@/lib/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { X, StickyNote, Save, ShieldCheck, AlertCircle, Trash2, Zap, LayoutGrid } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarSheetProps {
  isOpen: boolean;
  onClose: () => void;
  data: UserData;
  onToggleDate: (date: string) => void;
  onSaveNote: (date: string, content: string) => void;
}

export default function CalendarSheet({ isOpen, onClose, data, onToggleDate, onSaveNote }: CalendarSheetProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [noteMode, setNoteMode] = useState(false);
  const [currentNote, setCurrentNote] = useState("");
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const checkInDates = useMemo(() => (data?.checkIns || []).map(c => new Date(c.date)), [data?.checkIns]);
  const relapseDates = useMemo(() => (data?.relapses || []).map(r => new Date(r.timestamp)), [data?.relapses]);
  const noteDates = useMemo(() => (data?.notes || []).map(n => new Date(n.date)), [data?.notes]);
  
  const urgeHeatmap = useMemo(() => {
    const map: Record<string, number> = {};
    (data?.urges || []).forEach(u => {
      const date = format(new Date(u.timestamp), "yyyy-MM-dd");
      map[date] = (map[date] || 0) + 1;
    });
    return map;
  }, [data?.urges]);

  const handleDayClick = useCallback((day: Date) => {
    if (!day) return;
    const dateStr = format(day, "yyyy-MM-dd");
    onToggleDate(dateStr);
  }, [onToggleDate]);

  const handleLongPressStart = (day: Date) => {
    if (!day) return;
    longPressTimer.current = setTimeout(() => {
      const dateStr = format(day, "yyyy-MM-dd");
      const existingNote = (data?.notes || []).find(n => n.date === dateStr);
      setSelectedDate(day);
      setCurrentNote(existingNote?.content || "");
      setNoteMode(true);
    }, 600);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const saveNote = () => {
    if (selectedDate) {
      onSaveNote(format(selectedDate, "yyyy-MM-dd"), currentNote);
      setNoteMode(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] max-h-[90vh] rounded-t-[4rem] p-0 border border-white/10 glass-card outline-none flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500 ease-out">
        <div className="sr-only">
          <SheetTitle>Behavioral Hub</SheetTitle>
          <SheetDescription>Real-time mastery tracking and reflection.</SheetDescription>
        </div>

        <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mt-4 shrink-0 opacity-40 shadow-inner" />
        
        <div className="flex-1 overflow-y-auto px-8 pt-8 no-scrollbar relative">
          <AnimatePresence mode="wait">
            {!noteMode ? (
              <motion.div 
                key="calendar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full flex flex-col items-center"
              >
                <div className="w-full flex justify-between items-center mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[1.2rem] bg-primary/20 flex items-center justify-center text-primary shadow-[inset_0_0_10px_rgba(124,58,237,0.3)] border border-primary/20">
                      <LayoutGrid size={24} />
                    </div>
                    <div className="flex flex-col">
                      <h2 className="heading-strong text-xl">Behavioral Hub</h2>
                      <span className="label-dim">Neural History Protocol</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-11 w-11 bg-white/5 hover:bg-white/10 active:scale-90 transition-all border border-white/5">
                    <X size={20} className="text-white/100" />
                  </Button>
                </div>

                <div className="glass-card p-8 rounded-[3rem] w-full max-w-sm flex flex-col items-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  <Calendar 
                    mode="multiple" 
                    selected={checkInDates}
                    onDayClick={handleDayClick}
                    className="p-0 w-full"
                    modifiers={{
                      relapse: relapseDates,
                      hasNote: noteDates,
                    }}
                    classNames={{
                      month: "space-y-6 w-full",
                      caption: "flex justify-center pt-1 relative items-center mb-8",
                      caption_label: "heading-strong text-base uppercase tracking-[0.2em]",
                      head_cell: "label-dim text-center pb-4",
                    }}
                    components={{
                      Day: (dayProps: any) => {
                        const { day, modifiers, ...props } = dayProps;
                        if (!day?.date) return null;
                        
                        const date = day.date;
                        const dateStr = format(date, "yyyy-MM-dd");
                        const isClean = modifiers?.selected;
                        const isRelapse = modifiers?.relapse;
                        const hasNote = modifiers?.hasNote;
                        const isToday = modifiers?.today;
                        const urgeCount = urgeHeatmap[dateStr] || 0;

                        return (
                          <td className="p-0 relative flex-1" role="presentation">
                            <motion.button 
                              whileHover={{ scale: 1.15, zIndex: 10 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              {...props}
                              onPointerDown={() => handleLongPressStart(date)}
                              onPointerUp={handleLongPressEnd}
                              onPointerLeave={handleLongPressEnd}
                              className={cn(
                                "h-10 w-10 p-0 text-[12px] font-black flex items-center justify-center rounded-[1rem] relative transition-all duration-300",
                                isClean ? "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] scale-110" : 
                                isRelapse ? "bg-gradient-to-br from-red-500 to-red-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-110" : 
                                "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white",
                                isToday && !isClean && !isRelapse && "border-2 border-primary text-primary",
                                modifiers?.outside && "opacity-5",
                                hasNote && "after:absolute after:bottom-1 after:w-1.5 after:h-1.5 after:bg-purple-400 after:rounded-full after:shadow-[0_0_5px_rgba(168,85,247,0.8)]"
                              )}
                            >
                              {date.getDate()}
                              {urgeCount > 0 && !isRelapse && (
                                  <div className={cn(
                                      "absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border border-black/40 flex items-center justify-center text-[8px] font-black shadow-lg",
                                      urgeCount > 2 ? "bg-red-500 text-white" : "bg-amber-500 text-white"
                                  )}>
                                      {urgeCount}
                                  </div>
                              )}
                            </motion.button>
                          </td>
                        );
                      }
                    }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="note"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full h-full flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[1.2rem] bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/20">
                      <StickyNote size={24} />
                    </div>
                    <div className="flex flex-col">
                      <span className="label-dim text-purple-400 mb-0.5">Neural Reflection</span>
                      <span className="heading-strong text-xl">{selectedDate ? format(selectedDate, "MMM do, yyyy") : ''}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setNoteMode(false)} className="rounded-full h-10 w-10 bg-white/5">
                    <X size={18} />
                  </Button>
                </div>

                <Textarea 
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Record triggers, neural victories, or key lessons learned today..."
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 resize-none mb-8 text-base focus-visible:ring-1 focus-visible:ring-purple-500/40 text-white/90 leading-relaxed"
                />

                <div className="flex gap-4 mb-32">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setCurrentNote("");
                      onSaveNote(format(selectedDate!, "yyyy-MM-dd"), "");
                      setNoteMode(false);
                    }} 
                    className="h-16 rounded-[1.5rem] px-6 text-red-400 hover:bg-red-500/10 border border-white/5 active:scale-95 transition-all"
                  >
                    <Trash2 size={24} />
                  </Button>
                  <Button onClick={saveNote} className="flex-1 h-16 rounded-[1.5rem] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black uppercase tracking-widest gap-3 shadow-[0_10px_30px_rgba(124,58,237,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                    <Save size={20} /> Save Archive
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!noteMode && (
          <div className="sticky bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-xl px-8 pb-12 pt-6 border-t border-white/10 flex flex-col gap-6 z-20">
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-green-500/10 border border-green-500/30 shadow-[0_5px_15px_rgba(34,197,94,0.2)]">
                <ShieldCheck size={16} className="text-green-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-green-400/100">Clean</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-red-500/10 border border-red-500/30 shadow-[0_5px_15px_rgba(239,68,68,0.2)]">
                <AlertCircle size={16} className="text-red-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-red-400/100">Relapse</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 shadow-[0_5px_15px_rgba(245,158,11,0.2)]">
                <Zap size={16} className="text-amber-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-400/100">Intensity</span>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}