
"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RelapseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, time: string) => void;
}

const REASONS = ["Stress", "Boredom", "Social Media", "Late Night", "Loneliness", "Others"];
const TIMES = ["Morning", "Afternoon", "Evening", "Late Night"];

export default function RelapseModal({ isOpen, onClose, onSubmit }: RelapseModalProps) {
  const [reason, setReason] = useState("Boredom");
  const [time, setTime] = useState("Late Night");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card sm:max-w-[450px] max-h-[90vh] rounded-[3.5rem] border border-white/10 shadow-[0_0_50px_rgba(124,58,237,0.15)] p-0 overflow-hidden outline-none flex flex-col">
        <div className="bg-destructive/10 p-8 text-center border-b border-white/5 relative shrink-0">
          <Button 
            type="button"
            variant="ghost" 
            onClick={onClose} 
            className="absolute left-6 top-8 p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft size={24} />
          </Button>
          <div className="w-14 h-14 bg-destructive/20 text-destructive rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BrainCircuit size={28} />
          </div>
          <DialogTitle className="text-xl font-bold font-headline">Starting Over</DialogTitle>
          <DialogDescription className="text-muted-foreground/60 font-medium uppercase tracking-[0.2em] text-[8px] mt-1">Reflect on what happened</DialogDescription>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">What triggered it?</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="grid grid-cols-2 gap-3">
              {REASONS.map((r) => (
                <motion.div key={r} whileTap={{ scale: 0.98 }}>
                  <label 
                    htmlFor={r}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer h-full",
                      reason === r 
                        ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(124,58,237,0.2)]" 
                        : "bg-white/5 border-white/5 text-foreground/70 hover:bg-white/10"
                    )}
                  >
                    <RadioGroupItem value={r} id={r} className="sr-only" />
                    <span className="text-xs font-bold">{r}</span>
                  </label>
                </motion.div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">When did it happen?</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/5 font-bold focus:ring-1 focus:ring-primary/20">
                <SelectValue placeholder="Select window" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10 rounded-2xl">
                {TIMES.map(t => <SelectItem key={t} value={t} className="rounded-xl p-3 font-bold">{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="h-20" /> {/* Mobile safety spacer */}
        </div>

        <DialogFooter className="p-8 pt-0 shrink-0">
          <Button 
            type="button"
            className="w-full h-16 rounded-2xl font-bold bg-gradient-to-r from-primary to-secondary hover:scale-[1.02] active:scale-95 transition-all text-base shadow-[0_10px_30px_rgba(124,58,237,0.3)]"
            onClick={() => onSubmit(reason, time)}
          >
            Reset focus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
