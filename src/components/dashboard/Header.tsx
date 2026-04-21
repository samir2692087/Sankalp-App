"use client";

import { useState } from 'react';
import { 
  Settings, 
  Trash2, 
  Palette, 
  Sun, 
  Moon, 
  Sparkles, 
  Zap, 
  Bell, 
  Database,
  X,
  ChevronRight,
  Languages
} from 'lucide-react';
import SankalpIcon from '@/components/icons/SankalpIcon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AppTheme, UserData } from '@/lib/types';
import { cn } from '@/lib/utils';
import ReminderModal from '@/components/modals/ReminderModal';
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useVelocity, 
  useTransform, 
  useSpring 
} from 'framer-motion';
import Magnetic from './Magnetic';
import { feedback } from '@/lib/feedback-engine';
import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
  focusMode: boolean;
  theme: AppTheme;
  data: UserData;
  onThemeChange: (theme: AppTheme) => void;
  onReset: () => void;
  onToggleFocus: () => void;
  onShowExport: () => void;
  onUpdateReminder: (enabled: boolean, time: string) => void;
}

const springConfig = { type: "spring", stiffness: 150, damping: 18, mass: 1 };
const panelSpring = { type: "spring", stiffness: 180, damping: 22 };

export default function Header({ 
  focusMode, 
  theme, 
  data, 
  onThemeChange, 
  onReset, 
  onToggleFocus, 
  onShowExport,
  onUpdateReminder
}: HeaderProps) {
  const { t, language, setLanguage } = useLanguage();
  const [isThemeSheetOpen, setIsThemeSheetOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  const lagY = useSpring(useTransform(scrollVelocity, [-2000, 2000], [-15, 15]), {
    stiffness: 100,
    damping: 30
  });

  const themes: { id: AppTheme, nameKey: keyof typeof translations['en'], icon: any, bg: string }[] = [
    { id: 'light', nameKey: 'theme_light', icon: Sun, bg: 'bg-white' },
    { id: 'dark', nameKey: 'theme_dark', icon: Moon, bg: 'bg-slate-900' },
    { id: 'purple', nameKey: 'theme_purple', icon: Sparkles, bg: 'bg-purple-950' },
    { id: 'amoled', nameKey: 'theme_amoled', icon: Moon, bg: 'bg-black' },
  ];

  const handleOpenSettings = () => {
    feedback.tap();
    setIsSettingsOpen(true);
  };

  return (
    <>
      <header className="w-full flex items-center justify-between p-8 sticky top-0 z-[50] shrink-0 pointer-events-auto">
        <div className="absolute inset-0 bg-[#0B0F14]/60 backdrop-blur-2xl border-b border-white/5 pointer-events-none -z-10" />
        
        <div className="pointer-events-auto">
          <Magnetic strength={0.2}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-4 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center transition-all group-hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]">
                <SankalpIcon className="text-white" size={26} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-white font-black text-2xl leading-none tracking-tighter">{t('app_name')}</h1>
                <span className="text-white/30 font-black uppercase tracking-[0.3em] text-[8px]">{t('tagline')}</span>
              </div>
            </motion.div>
          </Magnetic>
        </div>

        <div className="pointer-events-auto flex items-center gap-4">
          <Magnetic strength={0.5}>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white font-black text-[10px] uppercase tracking-widest gap-2"
            >
              <Languages size={14} />
              {language === 'en' ? 'EN' : 'हिन्दी'}
            </Button>
          </Magnetic>

          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <div className="inline-block">
                <Magnetic strength={0.5} activeScale={1.1}>
                  <motion.div 
                    style={{ y: lagY }}
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotateZ: [0, 1, -1, 0]
                    }}
                    transition={{
                      scale: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                      rotateZ: { repeat: Infinity, duration: 6, ease: "easeInOut" }
                    }}
                  >
                    <Button 
                      variant="ghost" 
                      onClick={handleOpenSettings}
                      className="rounded-2xl w-14 h-14 glass-card flex items-center justify-center p-0 border-white/10 relative group overflow-hidden"
                    >
                      <motion.div
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-colors"
                      />
                      <Settings size={24} className="text-white/80 relative z-10 group-hover:rotate-45 transition-transform duration-500" />
                    </Button>
                  </motion.div>
                </Magnetic>
              </div>
            </DialogTrigger>

            <DialogContent 
              className="max-w-[440px] glass-card border-white/10 p-0 outline-none overflow-hidden rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
            >
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={panelSpring}
              >
                <div className="bg-white/[0.03] p-10 text-center border-b border-white/10 relative">
                  <DialogTitle className="text-2xl font-black text-white tracking-tight">{t('preferences')}</DialogTitle>
                  <DialogDescription className="text-white/30 font-black uppercase tracking-[0.25em] text-[9px] mt-1">{t('refine_resolve')}</DialogDescription>
                  
                  <div className="absolute top-8 right-8">
                     <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsSettingsOpen(false)}
                      className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/40"
                     >
                       <X size={16} />
                     </Button>
                  </div>
                </div>

                <div className="p-8 space-y-3">
                  {[
                    { label: t('appearance'), sub: t('choose_view'), icon: Palette, color: 'bg-purple-500/20 text-purple-400', action: () => { setIsThemeSheetOpen(true); setIsSettingsOpen(false); } },
                    { label: t('reminders'), sub: t('stay_steady'), icon: Bell, color: 'bg-blue-500/20 text-blue-400', action: () => { setIsReminderOpen(true); setIsSettingsOpen(false); } },
                    { label: t('archive'), sub: t('preferences'), icon: Database, color: 'bg-slate-500/20 text-slate-400', action: () => { onShowExport(); setIsSettingsOpen(false); } },
                    { label: t('focus_mode'), sub: focusMode ? t('active') : t('dormant'), icon: Zap, color: 'bg-yellow-500/20 text-yellow-400', action: () => { onToggleFocus(); setIsSettingsOpen(false); }, isToggle: true },
                    { label: t('language'), sub: language === 'en' ? 'English' : 'हिन्दी', icon: Languages, color: 'bg-green-500/20 text-green-400', action: () => setLanguage(language === 'en' ? 'hi' : 'en') },
                  ].map((item, idx) => (
                    <motion.div 
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...springConfig, delay: idx * 0.05 }}
                    >
                      <Button 
                        variant="ghost" 
                        onClick={item.action}
                        className="w-full h-18 rounded-[1.8rem] flex items-center gap-5 px-5 hover:bg-white/[0.05] transition-all group border border-transparent hover:border-white/10"
                      >
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg", item.color)}>
                          <item.icon size={22} />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-white font-bold text-sm">{item.label}</p>
                          <p className="text-white/30 text-[9px] uppercase font-black tracking-widest leading-none mt-1">{item.sub}</p>
                        </div>
                        {item.isToggle ? (
                          <div className={cn("w-10 h-5 rounded-full p-1 transition-all duration-500", focusMode ? 'bg-primary' : 'bg-white/10')}>
                            <motion.div 
                              animate={{ x: focusMode ? 20 : 0 }}
                              transition={springConfig}
                              className="w-3 h-3 rounded-full bg-white shadow-lg" 
                            />
                          </div>
                        ) : (
                          <ChevronRight size={16} className="text-white/10 group-hover:text-white/30 transition-colors" />
                        )}
                      </Button>
                    </motion.div>
                  ))}
                  
                  <div className="h-px bg-white/5 my-4" />
                  
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springConfig, delay: 0.3 }}>
                    <Button 
                      variant="ghost" 
                      onClick={() => { onReset(); setIsSettingsOpen(false); }}
                      className="w-full h-18 rounded-[1.8rem] flex items-center gap-5 px-5 hover:bg-red-500/10 text-red-500 group border border-transparent hover:border-red-500/20"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                        <Trash2 size={22} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-bold text-sm">{t('reset_path')}</p>
                        <p className="text-red-500/30 text-[9px] uppercase font-black tracking-widest mt-1">{t('reset')}</p>
                      </div>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <Sheet open={isThemeSheetOpen} onOpenChange={setIsThemeSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-[4rem] bg-[#07070a]/95 backdrop-blur-3xl border-white/10 p-10 pb-16 outline-none">
          <SheetHeader className="mb-10">
            <SheetTitle className="text-white font-black text-3xl text-center tracking-tighter">{t('choose_view')}</SheetTitle>
            <SheetDescription className="text-white/30 text-center uppercase tracking-[0.3em] text-[10px] font-black">{t('stay_steady')}</SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-5 max-w-xl mx-auto">
            {themes.map((t_item) => (
              <motion.button 
                key={t_item.id}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={springConfig}
                onClick={() => {
                  feedback.tap();
                  onThemeChange(t_item.id);
                }}
                className={cn(
                  "p-6 rounded-[2.2rem] flex flex-col gap-4 text-left border-2 transition-all group",
                  theme === t_item.id 
                    ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(168,85,247,0.3)]' 
                    : 'border-white/5 bg-white/[0.03] hover:border-white/20'
                )}
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12", t_item.bg)}>
                  <t_item.icon size={20} className={cn(t_item.id === 'light' ? 'text-blue-500' : 'text-white')} />
                </div>
                <span className="text-white font-black text-xs uppercase tracking-[0.2em]">{t(t_item.nameKey)}</span>
              </motion.button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {isReminderOpen && (
        <ReminderModal 
          isOpen={isReminderOpen} 
          onClose={() => setIsReminderOpen(false)} 
          enabled={data.notificationsEnabled} 
          time={data.reminderTime} 
          onUpdate={onUpdateReminder} 
        />
      )}
    </>
  );
}
