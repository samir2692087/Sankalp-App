
"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserProfile } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { User, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { feedback } from '@/lib/feedback-engine';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

export default function ProfileModal({ isOpen, onClose, profile, onUpdate }: ProfileModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [localProfile, setLocalProfile] = useState<UserProfile>({ 
    name: profile?.name || '',
    gender: profile?.gender || 'prefer-not-to-say',
    ageGroup: profile?.ageGroup || '18-24'
  });

  const handleSave = () => {
    if (!localProfile.name?.trim()) {
      feedback.warning();
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: t('error_name_required')
      });
      return;
    }

    feedback.success();
    onUpdate(localProfile);
    toast({
      title: t('stay_steady'),
      description: t('profile_updated')
    });
    onClose();
  };

  const GENDERS: { key: UserProfile['gender'], label: string }[] = [
    { key: 'male', label: t('gender_male') },
    { key: 'female', label: t('gender_female') },
    { key: 'other', label: t('gender_other') },
    { key: 'prefer-not-to-say', label: t('gender_none') },
  ];

  const AGE_GROUPS: { key: UserProfile['ageGroup'], label: string }[] = [
    { key: 'under-18', label: t('age_u18') },
    { key: '18-24', label: t('age_18_24') },
    { key: '25-34', label: t('age_25_34') },
    { key: '35-44', label: t('age_35_44') },
    { key: '45-plus', label: t('age_45p') },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card sm:max-w-[480px] rounded-[3.5rem] border-none shadow-[0_0_80px_rgba(0,0,0,0.8)] p-0 overflow-hidden outline-none">
        <div className="bg-primary/10 p-10 text-center border-b border-white/5 relative shrink-0">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose} 
            className="absolute left-6 top-10 rounded-full bg-white/5 hover:bg-white/10 text-white/40"
          >
            <ArrowLeft size={18} />
          </Button>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto w-20 h-20 rounded-[2rem] bg-primary/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(168,85,247,0.2)]"
          >
            <User className="text-primary" size={40} />
          </motion.div>
          
          <DialogTitle className="text-3xl font-bold font-headline tracking-tight">{t('profile_center')}</DialogTitle>
          <DialogDescription className="mt-2 text-white/30 font-black uppercase tracking-[0.25em] text-[9px]">{t('profile_desc')}</DialogDescription>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar max-h-[60vh]">
          <div className="p-10 space-y-10 pb-40">
            {/* Name Input */}
            <div className="space-y-4">
              <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-white/30 ml-2">{t('name_label')}</Label>
              <div className="relative group">
                <Input 
                  value={localProfile.name}
                  onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                  placeholder={t('name_placeholder')}
                  className="h-16 rounded-[1.8rem] bg-white/[0.03] border-white/5 font-bold text-lg px-8 transition-all focus:bg-white/[0.06] focus:border-primary/30 focus:ring-primary/20"
                />
                {localProfile.name && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-green-500"
                  >
                    <CheckCircle2 size={20} />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Gender Selection Chips */}
            <div className="space-y-4">
              <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-white/30 ml-2">{t('gender_label')}</Label>
              <div className="grid grid-cols-2 gap-3">
                {GENDERS.map((g) => {
                  const isActive = localProfile.gender === g.key;
                  return (
                    <motion.button
                      key={g.key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setLocalProfile({ ...localProfile, gender: g.key })}
                      className={cn(
                        "h-14 rounded-2xl border font-bold text-xs transition-all flex items-center justify-center px-4",
                        isActive 
                          ? "bg-primary text-white border-primary shadow-[0_0_20px_rgba(168,85,247,0.3)]" 
                          : "bg-white/[0.03] border-white/5 text-white/40 hover:border-white/10 hover:bg-white/[0.05]"
                      )}
                    >
                      {g.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Age Group Selection Chips (Fixed Visibility Issue) */}
            <div className="space-y-4">
              <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-white/30 ml-2">{t('age_label')}</Label>
              <div className="grid grid-cols-2 gap-3">
                {AGE_GROUPS.map((a) => {
                  const isActive = localProfile.ageGroup === a.key;
                  return (
                    <motion.button
                      key={a.key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setLocalProfile({ ...localProfile, ageGroup: a.key })}
                      className={cn(
                        "h-14 rounded-2xl border font-bold text-xs transition-all flex items-center justify-center px-4",
                        isActive 
                          ? "bg-primary text-white border-primary shadow-[0_0_20px_rgba(168,85,247,0.3)]" 
                          : "bg-white/[0.03] border-white/5 text-white/40 hover:border-white/10 hover:bg-white/[0.05]"
                      )}
                    >
                      {a.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Privacy Shield */}
            <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} className="text-green-500" />
              </div>
              <p className="text-[11px] leading-relaxed text-white/40 font-medium">
                {t('privacy_note')}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-8 bg-[#0b0b0f] border-t border-white/5">
          <Button 
            onClick={handleSave}
            className="w-full h-18 rounded-[2rem] font-black bg-primary text-white shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-[0.3em] gap-3"
          >
            <CheckCircle2 size={18} />
            {t('save_profile')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
