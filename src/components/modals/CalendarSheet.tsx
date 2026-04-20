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
      <SheetContent side="bottom" className="h-[90vh] max-h-[90vh] rounded-t-[3rem] p-0 border-t border-slate-200 bg-white/95 backdrop-blur-md outline-none flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="sr-only">
          <SheetTitle>Behavioral Hub</SheetTitle>
          <SheetDescription>High-precision tracking and mastery logs.</SheetDescription>
        </div>

        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mt-4 shrink-0" />
        
        <div className="flex-1 overflow-y-auto px-6 pt-6 no-scrollbar relative">
          <AnimatePresence mode="wait">
            {!noteMode ? (
              <motion.div 
                key="calendar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center"
              >
                <div className="w-full flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 border border-slate-200">
                      <LayoutGrid size={20} />
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">Behavioral Hub</h2>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Neural History Protocol</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-10 w-10 hover:bg-slate-100 text-slate-600">
                    <X size={20} />
                  </Button>
                </div>

                <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-6 rounded-[2rem] w-full max-w-sm flex flex-col items-center relative">
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
                      month: "space-y-4 w-full",
                      caption: "flex justify-center pt-1 relative items-center mb-4",
                      caption_label: "text-sm font-bold text-slate-900 uppercase tracking-widest",
                      head_cell: "text-slate-400 font-bold uppercase text-[9px] tracking-widest text-center pb-2",
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
                          <td className="p-0.5 relative flex-1" role="presentation">
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              {...props}
                              onPointerDown={() => handleLongPressStart(date)}
                              onPointerUp={handleLongPressEnd}
                              onPointerLeave={handleLongPressEnd}
                              className={cn(
                                "h-9 w-9 p-0 text-[11px] font-bold flex items-center justify-center rounded-lg relative transition-all",
                                isClean ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-200" : 
                                isRelapse ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-200" : 
                                "text-slate-800 hover:bg-slate-50 border border-transparent",
                                isToday && !isClean && !isRelapse && "border-slate-300 bg-slate-50",
                                modifiers?.outside && "opacity-20",
                                hasNote && "after:absolute after:bottom-1 after:w-1 after:h-1 after:bg-indigo-500 after:rounded-full"
                              )}
                            >
                              {date.getDate()}
                              {urgeCount > 0 && !isRelapse && (
                                  <div className={cn(
                                      "absolute -top-1 -right-1 w-4 h-4 rounded-full border border-white flex items-center justify-center text-[8px] font-black shadow-sm",
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
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                      <StickyNote size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase text-indigo-400">Neural Reflection</span>
                      <span className="text-lg font-bold text-slate-900">{selectedDate ? format(selectedDate, "MMM do, yyyy") : ''}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setNoteMode(false)} className="rounded-full h-10 w-10 text-slate-500">
                    <X size={20} />
                  </Button>
                </div>

                <Textarea 
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Record triggers, neural victories, or key lessons..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-6 resize-none mb-6 text-slate-800 focus-visible:ring-indigo-500/20"
                />

                <div className="flex gap-4 mb-20">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setCurrentNote("");
                      onSaveNote(format(selectedDate!, "yyyy-MM-dd"), "");
                      setNoteMode(false);
                    }} 
                    className="h-14 rounded-xl px-6 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50"
                  >
                    <Trash2 size={20} />
                  </Button>
                  <Button onClick={saveNote} className="flex-1 h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-widest gap-2 shadow-lg active:scale-95 transition-all">
                    <Save size={18} /> Save Archive
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!noteMode && (
          <div className="sticky bottom-0 left-0 w-full bg-white border-t border-slate-100 p-6 flex flex-col gap-4 z-20">
            <div className="grid grid-cols-3 gap-3 w-full">
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-green-500 text-white shadow-lg shadow-green-100">
                <ShieldCheck size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Clean</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-red-500 text-white shadow-lg shadow-red-100">
                <AlertCircle size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Relapse</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-100">
                <Zap size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Intensity</span>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
