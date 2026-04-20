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
import { X, StickyNote, Save, Calendar as CalendarIcon, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { cn } from '@/lib/utils';

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
      <SheetContent side="bottom" className="h-[85vh] max-h-[85vh] rounded-t-[3.5rem] p-0 border-none glass-card outline-none flex flex-col animate-in slide-in-from-bottom duration-500 ease-out overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="sr-only">
          <SheetTitle>Mastery Calendar</SheetTitle>
          <SheetDescription>Review your discipline history, toggle status, and add personal notes.</SheetDescription>
        </div>

        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mt-4 shrink-0 opacity-40" />
        
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col items-center">
          {!noteMode ? (
            <div className="w-full max-w-sm flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <CalendarIcon size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block leading-none mb-1">Activity Log</span>
                    <span className="font-bold font-headline text-lg text-foreground">Mastery Hub</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-10 w-10 hover:bg-primary/5 active:scale-90 transition-all">
                  <X size={20} />
                </Button>
              </div>

              <div className="neu-flat p-6 rounded-[2.5rem] bg-card w-full border border-white/10 flex flex-col items-center shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-primary to-red-400 opacity-20" />
                
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
                    caption: "flex justify-center pt-1 relative items-center mb-6",
                    caption_label: "text-base font-black font-headline uppercase tracking-[0.15em]",
                    head_cell: "text-muted-foreground font-black text-[9px] uppercase tracking-widest opacity-40 text-center pb-4",
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

                      return (
                        <td className="p-0 relative flex-1" role="presentation">
                          <button 
                            type="button"
                            {...props}
                            onPointerDown={() => handleLongPressStart(date)}
                            onPointerUp={handleLongPressEnd}
                            onPointerLeave={handleLongPressEnd}
                            className={cn(
                              "h-10 w-10 p-0 text-xs font-bold flex items-center justify-center rounded-full relative transition-all duration-300",
                              "hover:scale-110 active:scale-90",
                              isClean ? "bg-green-500 text-white shadow-lg shadow-green-500/30" : 
                              isRelapse ? "bg-red-500 text-white shadow-lg shadow-red-500/30" : 
                              "hover:bg-primary/10",
                              isToday && !isClean && !isRelapse && "border-2 border-primary text-primary",
                              modifiers?.outside && "opacity-10",
                              hasNote && "after:absolute after:bottom-1 after:w-1 after:h-1 after:bg-purple-500 after:rounded-full after:animate-pulse"
                            )}
                          >
                            {date.getDate()}
                            {hasNote && (isClean || isRelapse) && (
                              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-purple-500 rounded-full border-2 border-card" />
                            )}
                          </button>
                        </td>
                      );
                    }
                  }}
                />
              </div>
              
              <div className="mt-10 flex flex-col gap-5 w-full">
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-green-500/5 border border-green-500/10">
                    <ShieldCheck size={14} className="text-green-500" />
                    <span className="text-[9px] font-black uppercase text-green-600/60">Clean</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-red-500/5 border border-red-500/10">
                    <AlertCircle size={14} className="text-red-500" />
                    <span className="text-[9px] font-black uppercase text-red-600/60">Relapse</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                    <StickyNote size={14} className="text-purple-500" />
                    <span className="text-[9px] font-black uppercase text-purple-600/60">Note</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30 border border-white/5">
                  <Info size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-[10px] text-muted-foreground/80 font-medium leading-relaxed italic">
                    Tap a date to toggle status. Long press to record thoughts, triggers, or victories for that day.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-sm h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-400">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-inner">
                    <StickyNote size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-muted-foreground leading-none mb-1.5 tracking-widest">Entry Reflection</span>
                    <span className="font-bold font-headline text-xl text-foreground">{selectedDate ? format(selectedDate, "MMMM do, yyyy") : ''}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setNoteMode(false)} className="rounded-full h-10 w-10">
                  <X size={24} />
                </Button>
              </div>

              <Textarea 
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="How was your discipline? Record triggers, victories, or lessons..."
                className="flex-1 neu-inset border-none rounded-[2.5rem] p-8 resize-none mb-8 text-base focus-visible:ring-2 focus-visible:ring-purple-500/20 bg-background/50 min-h-[200px] leading-relaxed"
              />

              <Button onClick={saveNote} className="w-full h-16 rounded-[2rem] bg-purple-600 hover:bg-purple-700 text-white font-bold gap-3 shadow-xl shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all text-lg">
                <Save size={20} /> Save reflection
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
