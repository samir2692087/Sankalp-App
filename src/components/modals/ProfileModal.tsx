
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { UserProfile } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { User, ShieldCheck, ArrowLeft } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

export default function ProfileModal({ isOpen, onClose, profile, onUpdate }: ProfileModalProps) {
  const { t } = useLanguage();
  const [localProfile, setLocalProfile] = useState<UserProfile>({ ...profile });

  const handleSave = () => {
    onUpdate(localProfile);
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
      <DialogContent className="glass-card sm:max-w-[450px] rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden outline-none">
        <div className="bg-primary/10 p-8 text-center border-b border-white/5 relative shrink-0">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="absolute left-6 top-8 p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft size={24} />
          </Button>
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
            <User className="text-primary" size={32} />
          </div>
          <DialogTitle className="text-2xl font-bold font-headline">{t('profile_center')}</DialogTitle>
          <DialogDescription className="mt-2 text-white/40 font-bold uppercase tracking-widest text-[9px]">{t('profile_desc')}</DialogDescription>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="p-8 space-y-6 pb-60"> {/* Mobile Keyboard Buffer */}
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase tracking-widest text-white/40 ml-1">{t('name_label')}</Label>
              <Input 
                value={localProfile.name || ''}
                onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                placeholder={t('name_placeholder')}
                className="h-14 rounded-2xl bg-white/[0.03] border-white/5 font-bold focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-widest text-white/40 ml-1">{t('gender_label')}</Label>
                <Select 
                  value={localProfile.gender} 
                  onValueChange={(v) => setLocalProfile({ ...localProfile, gender: v as any })}
                >
                  <SelectTrigger className="h-14 rounded-2xl bg-white/[0.03] border-white/5 font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10 rounded-2xl">
                    {GENDERS.map(g => <SelectItem key={g.key} value={g.key!} className="rounded-xl p-3 font-bold">{g.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-widest text-white/40 ml-1">{t('age_label')}</Label>
                <Select 
                  value={localProfile.ageGroup} 
                  onValueChange={(v) => setLocalProfile({ ...localProfile, ageGroup: v as any })}
                >
                  <SelectTrigger className="h-14 rounded-2xl bg-white/[0.03] border-white/5 font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10 rounded-2xl">
                    {AGE_GROUPS.map(a => <SelectItem key={a.key} value={a.key!} className="rounded-xl p-3 font-bold">{a.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
              <ShieldCheck size={18} className="text-green-500 shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-white/50 font-medium">
                {t('privacy_note')}
              </p>
            </div>

            <Button 
              onClick={handleSave}
              className="w-full h-16 rounded-2xl font-bold bg-primary text-white shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-[0.2em]"
            >
              {t('save_profile')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
