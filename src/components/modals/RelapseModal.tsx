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
import { ArrowLeft } from 'lucide-react';

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
      <DialogContent className="glass-card sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-8 outline-none">
        <DialogHeader className="relative">
          <Button 
            type="button"
            variant="ghost" 
            onClick={onClose} 
            className="absolute -left-2 top-0 p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft size={24} />
          </Button>
          <DialogTitle className="text-2xl font-bold font-headline text-center w-full">It's a New Beginning</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground mt-2">Failure is part of growth. Let's analyze and move forward.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <Label className="font-bold">What was the trigger?</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="grid grid-cols-2 gap-2">
              {REASONS.map((r) => (
                <div key={r} className="flex items-center space-x-2 p-2 rounded-xl neu-inset">
                  <RadioGroupItem value={r} id={r} />
                  <Label htmlFor={r} className="cursor-pointer text-xs">{r}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-3">
            <Label className="font-bold">When did it happen?</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="neu-inset border-none rounded-xl h-12">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button"
            className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 transition-all text-lg shadow-lg"
            onClick={() => onSubmit(reason, time)}
          >
            Restart My Journey
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}