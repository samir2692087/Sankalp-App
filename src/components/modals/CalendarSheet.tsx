"use client";

import { useState, useCallback, useRef, useMemo } from 'react';
import PortalSheet from "@/components/ui/portal-sheet";
import { Calendar } from "@/components/ui/calendar";
import { UserData } from "@/lib/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { X, StickyNote, Save, AlertCircle, Trash2, Zap, LayoutGrid, ArrowLeft } from 'lucide-react';
import SankalpIcon from '@/components/icons/SankalpIcon';
import { Textarea } from "@/components/ui/textarea";
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface CalendarSheetProps {
  isOpen: boolean;
  onClose: () => void;
  data: UserData;
  onToggleDate: (date: string) => void;
  onSaveNote: (date: string, content: string) => void;
}

export default function CalendarSheet({ isOpen, onClose, data, onToggleDate, onSaveNote }: CalendarSheetProps) {
  const { t } = useLanguage();
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
    <PortalSheet 
      isOpen={isOpen} 
      onClose={onClose}
      title={noteMode ? t('reflection') : t('mastery_hub')}
      description={noteMode ? (selectedDate ? format(selectedDate, "MMM do, yyyy") : '') : t('personal_history')}
    >
      <AnimatePresence mode="wait">
        {!noteMode ? (
          <motion.div 
            key="calendar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center"
          >
            <div className="bg-white/5 border border-white/10 shadow-2xl p-6 rounded-[2.5rem] w-full max-w-sm flex flex-col items-center relative mb-8">
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
                  caption_label: "text-sm font-bold text-white uppercase tracking-widest",
                  head_cell: "text-white/20 font-bold uppercase text-[9px] tracking-widest text-center pb-2",
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
                            isClean ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/20" : 
                            isRelapse ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20" : 
                            "text-white/80 hover:bg-white/10 border border-transparent",
                            isToday && !isClean && !isRelapse && "border-white/30 bg-white/5",
                            modifiers?.outside && "opacity-20",
                            hasNote && "after:absolute after:bottom-1 after:w-1 after:h-1 after:bg-primary after:rounded-full"
                          )}
                        >
                          {date.getDate()}
                          {urgeCount > 0 && !isRelapse && (
                              <div className={cn(
                                  "absolute -top-1 -right-1 w-4 h-4 rounded-full border border-black flex items-center justify-center text-[8px] font-black shadow-sm",
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

            <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
              <div className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500">
                <SankalpIcon size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">{t('clean')}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500">
                <AlertCircle size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">{t('reset')}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                <Zap size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">{t('intensity')}</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="note"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full flex flex-col gap-6"
          >
            <div className="flex items-center gap-4 mb-2">
              <Button variant="ghost" size="icon" onClick={() => setNoteMode(false)} className="rounded-full bg-white/5">
                <ArrowLeft size={18} />
              </Button>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">{selectedDate ? format(selectedDate, "MMM do, yyyy") : ''}</span>
              </div>
            </div>

            <Textarea 
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder={t('reflection_placeholder')}
              className="min-h-[200px] bg-white/[0.03] border-white/10 rounded-[2rem] p-8 resize-none text-white focus-visible:ring-primary/20 text-base leading-relaxed"
            />

            <div className="flex gap-4">
              <Button 
                variant="outline"
                onClick={() => {
                  setCurrentNote("");
                  onSaveNote(format(selectedDate!, "yyyy-MM-dd"), "");
                  setNoteMode(false);
                }} 
                className="h-16 rounded-2xl px-6 border-white/10 text-white/40 hover:text-red-500 hover:bg-red-500/10"
              >
                <Trash2 size={22} />
              </Button>
              <Button onClick={saveNote} className="flex-1 h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.2em] text-xs gap-3 shadow-2xl">
                <Save size={20} /> {t('save_archive')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PortalSheet>
  );
}
