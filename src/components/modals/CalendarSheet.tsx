
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
import { X, StickyNote, Save, ShieldCheck, AlertCircle, Info, Trash2, Zap } from 'lucide-react';
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
      <SheetContent side="bottom" className="h-[85vh] max-h-[85vh] rounded-t-[3.5rem] p-0 border-none glass-card outline-none flex flex-col animate-in slide-in-from-bottom duration-500 ease-out">
        <div className="sr-only">
          <SheetTitle>Mastery Hub</SheetTitle>
          <SheetDescription>Behavioral heatmap and discipline timeline.</SheetDescription>
        </div>

        <div className="w-12 h-1 bg-muted rounded-full mx-auto mt-3 shrink-0 opacity-40" />
        
        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-24 flex flex-col items-center no-scrollbar">
          {!noteMode ? (
            <div className="w-full max-w-sm flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <Zap size={20} />
                  </div>
                  <h2 className="font-bold font-headline text-lg text-foreground tracking-tight">Behavioral Hub</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-9 w-9 hover:bg-primary/5 active:scale-90 transition-all">
                  <X size={18} />
                </Button>
              </div>

              <div className="neu-flat p-5 rounded-[2.5rem] bg-card w-full border border-white/5 flex flex-col items-center shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500/20 via-primary/20 to-red-500/20" />
                
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
                    caption_label: "text-sm font-black font-headline uppercase tracking-widest",
                    head_cell: "text-muted-foreground font-black text-[9px] uppercase tracking-widest opacity-40 text-center pb-2",
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
                          <button 
                            type="button"
                            {...props}
                            onPointerDown={() => handleLongPressStart(date)}
                            onPointerUp={handleLongPressEnd}
                            onPointerLeave={handleLongPressEnd}
                            className={cn(
                              "h-9 w-9 p-0 text-[11px] font-bold flex items-center justify-center rounded-full relative transition-all duration-300",
                              "hover:scale-105 active:scale-95",
                              isClean ? "bg-green-500 text-white shadow-md shadow-green-500/20" : 
                              isRelapse ? "bg-red-500 text-white shadow-md shadow-red-500/20" : 
                              "hover:bg-primary/5",
                              urgeCount > 0 && !isClean && !isRelapse && "bg-amber-100 text-amber-700",
                              urgeCount > 2 && !isClean && !isRelapse && "bg-amber-500 text-white",
                              isToday && !isClean && !isRelapse && "border-2 border-primary text-primary",
                              modifiers?.outside && "opacity-10",
                              hasNote && "after:absolute after:bottom-1 after:w-1 after:h-1 after:bg-purple-500 after:rounded-full"
                            )}
                          >
                            {date.getDate()}
                            {urgeCount > 0 && (
                                <div className={cn(
                                    "absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full border border-white flex items-center justify-center text-[6px]",
                                    urgeCount > 2 ? "bg-red-500 text-white" : "bg-amber-500 text-white"
                                )}>
                                    {urgeCount}
                                </div>
                            )}
                          </button>
                        </td>
                      );
                    }
                  }}
                />
              </div>
              
              <div className="mt-8 grid grid-cols-3 gap-3 w-full">
                <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-green-500/5 border border-green-500/10">
                  <ShieldCheck size={12} className="text-green-500" />
                  <span className="text-[8px] font-black uppercase text-green-600/60">Clean</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-red-500/5 border border-red-500/10">
                  <AlertCircle size={12} className="text-red-500" />
                  <span className="text-[8px] font-black uppercase text-red-600/60">Relapse</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                  <Zap size={12} className="text-amber-500" />
                  <span className="text-[8px] font-black uppercase text-amber-600/60">Heatmap</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 p-3 rounded-2xl bg-muted/20 border border-white/5 w-full">
                <Info size={12} className="text-muted-foreground shrink-0" />
                <p className="text-[9px] text-muted-foreground/80 font-medium leading-tight">
                  Intelligent Heatmap: Darker Amber = More Battles Resisted.
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-sm h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-400">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-inner">
                    <StickyNote size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-muted-foreground leading-none mb-1 tracking-widest">Reflection</span>
                    <span className="font-bold font-headline text-lg text-foreground">{selectedDate ? format(selectedDate, "MMM do, yyyy") : ''}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setNoteMode(false)} className="rounded-full h-8 w-8">
                  <X size={18} />
                </Button>
              </div>

              <Textarea 
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Triggers, victories, or lessons learned today..."
                className="flex-1 neu-inset border-none rounded-[2rem] p-6 resize-none mb-6 text-sm focus-visible:ring-1 focus-visible:ring-purple-500/20 bg-background/50 min-h-[160px] leading-relaxed"
              />

              <div className="flex gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setCurrentNote("");
                    onSaveNote(format(selectedDate!, "yyyy-MM-dd"), "");
                    setNoteMode(false);
                  }} 
                  className="h-14 rounded-2xl px-4 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 size={18} />
                </Button>
                <Button onClick={saveNote} className="flex-1 h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold gap-3 shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                  <Save size={18} /> Save Entry
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
