"use client";

import { useState, useCallback, useRef } from 'react';
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
import { X, StickyNote, Save, Calendar as CalendarIcon } from 'lucide-react';
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

  const checkInDates = (data?.checkIns || []).map(c => new Date(c.date));
  
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
      <SheetContent side="bottom" className="h-[70vh] rounded-t-[3.5rem] p-0 border-none glass-card outline-none overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-500 ease-out">
        {/* Accessible Titles (Visually Hidden) */}
        <div className="sr-only">
          <SheetTitle>Mastery Calendar</SheetTitle>
          <SheetDescription>Review your discipline history, toggle status, and add personal notes.</SheetDescription>
        </div>

        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mt-4 shrink-0" />
        
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col items-center">
          {!noteMode ? (
            <div className="w-full max-w-sm flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <CalendarIcon size={16} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-foreground">Protocol History</span>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 hover:bg-primary/5">
                  <X size={18} />
                </Button>
              </div>

              <div className="neu-flat p-4 rounded-[2.5rem] bg-card w-full border border-white/5">
                <Calendar 
                  mode="multiple" 
                  selected={checkInDates}
                  onDayClick={handleDayClick}
                  className="p-0"
                  components={{
                    Day: (dayProps: any) => {
                      const { date, displayMonth, modifiers, ...props } = dayProps;
                      if (!date) return null;

                      const dateStr = format(date, "yyyy-MM-dd");
                      const hasNote = (data?.notes || []).some(n => n.date === dateStr);
                      const isSelected = modifiers?.selected;

                      return (
                        <td className="p-0 relative flex-1" role="presentation">
                          <button 
                            type="button"
                            {...props}
                            onPointerDown={() => handleLongPressStart(date)}
                            onPointerUp={handleLongPressEnd}
                            onPointerLeave={handleLongPressEnd}
                            className={cn(
                              "h-10 w-10 p-0 font-medium flex items-center justify-center rounded-full relative transition-all duration-200",
                              isSelected ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105" : "hover:bg-primary/5",
                              modifiers?.today && !isSelected && "border border-primary/30 text-primary",
                              modifiers?.outside && "opacity-20",
                              hasNote && !isSelected && "after:absolute after:bottom-1 after:w-1 after:h-1 after:bg-primary after:rounded-full"
                            )}
                          >
                            {date.getDate()}
                            {hasNote && isSelected && (
                              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full border border-primary" />
                            )}
                          </button>
                        </td>
                      );
                    }
                  }}
                />
              </div>
              
              <div className="mt-10 flex flex-col gap-3 w-full">
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" /> Mark Clean
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
                    <div className="w-2.5 h-2.5 rounded-full border border-primary" /> Today
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-background" /> Has Note
                  </div>
                </div>
                <p className="text-[9px] text-center text-muted-foreground/60 uppercase font-black tracking-widest mt-2">
                  Tap for status • Long press for reflection
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-sm h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-400">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <StickyNote size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-muted-foreground leading-none mb-1">Daily Reflection</span>
                    <span className="font-bold font-headline text-lg">{selectedDate ? format(selectedDate, "MMMM do, yyyy") : ''}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setNoteMode(false)} className="rounded-full">
                  <X size={20} />
                </Button>
              </div>

              <Textarea 
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="How was your discipline today? Record any triggers, victories, or lessons learned..."
                className="flex-1 neu-inset border-none rounded-[2rem] p-6 resize-none mb-8 text-sm focus-visible:ring-1 focus-visible:ring-primary/20 bg-background/50"
              />

              <Button onClick={saveNote} className="w-full h-14 rounded-2xl bg-primary text-white font-bold gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                <Save size={18} /> Save Entry
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
