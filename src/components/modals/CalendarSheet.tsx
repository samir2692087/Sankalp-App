
"use client";

import { useState, useCallback, useRef } from 'react';
import { 
  Sheet, 
  SheetContent, 
} from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { UserData } from "@/lib/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { X, StickyNote, Save } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

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

  const checkInDates = data.checkIns.map(c => new Date(c.date));
  
  const handleDayClick = useCallback((day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    onToggleDate(dateStr);
  }, [onToggleDate]);

  const handleLongPressStart = (day: Date) => {
    longPressTimer.current = setTimeout(() => {
      const dateStr = format(day, "yyyy-MM-dd");
      const existingNote = data.notes.find(n => n.date === dateStr);
      setSelectedDate(day);
      setCurrentNote(existingNote?.content || "");
      setNoteMode(true);
    }, 600);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
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
      <SheetContent side="bottom" className="h-[70vh] rounded-t-[3.5rem] p-0 border-none glass-card outline-none overflow-hidden flex flex-col">
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mt-4 shrink-0" />
        
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col items-center">
          {!noteMode ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mastery Calendar</span>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X size={20} />
                </Button>
              </div>

              <div className="neu-flat p-4 rounded-[2.5rem] bg-card w-full max-w-sm">
                <Calendar 
                  mode="multiple" 
                  selected={checkInDates}
                  onDayClick={handleDayClick}
                  className="rounded-3xl border-none"
                  modifiers={{
                    hasNote: (date) => data.notes.some(n => n.date === format(date, "yyyy-MM-dd"))
                  }}
                  modifiersStyles={{
                    hasNote: { borderBottom: '2px solid hsl(var(--primary))' }
                  }}
                  components={{
                    Day: ({ date, ...props }) => (
                      <div 
                        onPointerDown={() => handleLongPressStart(date)}
                        onPointerUp={handleLongPressEnd}
                        onPointerLeave={handleLongPressEnd}
                        className="relative"
                      >
                        <button {...props} className={`${props.className} relative`}>
                          {date.getDate()}
                          {data.notes.some(n => n.date === format(date, "yyyy-MM-dd")) && (
                            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary rounded-full" />
                          )}
                        </button>
                      </div>
                    )
                  }}
                />
              </div>
              
              <div className="mt-8 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                Tap to toggle status • Long press for notes
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <StickyNote className="text-primary" size={20} />
                  <span className="font-bold font-headline">{format(selectedDate!, "MMMM do, yyyy")}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setNoteMode(false)}>
                  <X size={20} />
                </Button>
              </div>

              <Textarea 
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="How was your focus today? Any triggers or victories?"
                className="flex-1 neu-inset border-none rounded-3xl p-6 resize-none mb-6 text-sm"
              />

              <Button onClick={saveNote} className="w-full h-14 rounded-2xl bg-primary text-white font-bold gap-2">
                <Save size={18} /> Save Entry
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
