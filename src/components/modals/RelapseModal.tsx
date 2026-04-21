
"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface RelapseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, time: string) => void;
}

export default function RelapseModal({ isOpen, onClose, onSubmit }: RelapseModalProps) {
  const { t } = useLanguage();
  const [reason, setReason] = useState("reason_boredom");
  const [time, setTime] = useState("time_night");

  const REASONS = [
    { key: "reason_stress", label: t('reason_stress') },
    { key: "reason_boredom", label: t('reason_boredom') },
    { key: "reason_social", label: t('reason_social') },
    { key: "reason_night", label: t('reason_night') },
    { key: "reason_lonely", label: t('reason_lonely') },
    { key: "reason_others", label: t('reason_others') },
  ];

  const TIMES = [
    { key: "time_morning", label: t('time_morning') },
    { key: "time_afternoon", label: t('time_afternoon') },
    { key: "time_evening", label: t('time_evening') },
    { key: "time_night", label: t('time_night') },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card sm:max-w-[450px] rounded-[3.5rem] border border-white/10 shadow-[0_0_50px_rgba(124,58,237,0.15)] p-0 overflow-hidden outline-none">
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
          <DialogTitle className="text-xl font-bold font-headline">{t('starting_over')}</DialogTitle>
          <DialogDescription className="text-muted-foreground/60 font-medium uppercase tracking-[0.2em] text-[8px] mt-1">{t('reflect_happened')}</DialogDescription>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="p-8 space-y-8 pb-60">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('trigger_question')}</Label>
              <RadioGroup value={reason} onValueChange={setReason} className="grid grid-cols-2 gap-3">
                {REASONS.map((r) => (
                  <motion.div key={r.key} whileTap={{ scale: 0.98 }}>
                    <label 
                      htmlFor={r.key}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer h-full",
                        reason === r.key 
                          ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(124,58,237,0.2)]" 
                          : "bg-white/5 border-white/5 text-foreground/70 hover:bg-white/10"
                      )}
                    >
                      <RadioGroupItem value={r.key} id={r.key} className="sr-only" />
                      <span className="text-xs font-bold">{r.label}</span>
                    </label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('when_question')}</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/5 font-bold focus:ring-1 focus:ring-primary/20">
                  <SelectValue placeholder={t('select_window')} />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10 rounded-2xl">
                  {TIMES.map(t_item => <SelectItem key={t_item.key} value={t_item.key} className="rounded-xl p-3 font-bold">{t_item.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="button"
              className="w-full h-16 rounded-2xl font-bold bg-gradient-to-r from-primary to-secondary hover:scale-[1.02] active:scale-95 transition-all text-base shadow-[0_10px_30px_rgba(124,58,237,0.3)]"
              onClick={() => onSubmit(t(reason as any), t(time as any))}
            >
              {t('reset_focus')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
