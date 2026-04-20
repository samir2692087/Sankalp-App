"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  ShieldCheck, 
  ShieldAlert, 
  X, 
  Search, 
  Lock, 
  Sparkles,
  Shield,
  RefreshCw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  GraduationCap,
  Youtube,
  SearchCode,
  FileText,
  Zap
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { assessContentSafety, filterSearchQuery, formatBrowserInput } from '@/lib/guardian-engine';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface BrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
}

const QUICK_ACCESS = [
  { name: 'Wikipedia', icon: BookOpen, url: 'https://en.wikipedia.org' },
  { name: 'Scholar', icon: GraduationCap, url: 'https://scholar.google.com' },
  { name: 'Medium', icon: FileText, url: 'https://medium.com' },
  { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com' },
  { name: 'Docs', icon: SearchCode, url: 'https://nextjs.org/docs' }
];

export default function BrowserModal({ isOpen, onClose, streak }: BrowserModalProps) {
  const { toast } = useToast();
  const [url, setUrl] = useState('https://www.google.com');
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [safetyStatus, setSafetyStatus] = useState<'SAFE' | 'WARN' | 'BLOCKED'>('SAFE');
  const [guardianScore, setGuardianScore] = useState(100);
  const [blockReason, setBlockReason] = useState('');
  const [shake, setShake] = useState(false);
  const [isBlurActive, setIsBlurActive] = useState(false);
  
  const [history, setHistory] = useState<string[]>(['https://www.google.com']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const navigateTo = useCallback((target: string, addToHistory = true) => {
    if (!target) return;
    
    setIsLoading(true);
    const scrubbed = filterSearchQuery(target);
    const finalUrl = formatBrowserInput(scrubbed);
    
    // Guardian Content Assessment
    const assessment = assessContentSafety(finalUrl, streak);

    // Update Stability State - NO FULL SCREEN BLOCKING
    setSafetyStatus(assessment.status);
    setGuardianScore(100 - assessment.riskScore);
    setIsBlurActive(assessment.isBlurRequired || assessment.status === 'BLOCKED');
    setBlockReason(assessment.reason);

    if (assessment.status === 'BLOCKED') {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }

    setUrl(finalUrl);
    setInputUrl(finalUrl);
    
    if (addToHistory) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(finalUrl);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }

    // Simulate Network environment scanning
    setTimeout(() => setIsLoading(false), 800);
  }, [streak, history, historyIndex]);

  const handleBack = () => {
    if (historyIndex > 0) {
      const prevUrl = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      navigateTo(prevUrl, false);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const nextUrl = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      navigateTo(nextUrl, false);
    }
  };

  const handleReload = () => navigateTo(url, false);
  const handleHome = () => navigateTo('https://www.google.com');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[96vw] lg:max-w-7xl h-[92vh] p-0 overflow-hidden bg-[#07070a] border-white/5 rounded-[2.5rem] shadow-[0_0_120px_rgba(0,0,0,0.9)] flex flex-col pointer-events-auto outline-none">
        <div className="sr-only">
          <DialogTitle>Discipline Browser - Neural Navigation HUD</DialogTitle>
        </div>

        {/* Browser Top Bar - Chrome HUD */}
        <div className="bg-[#0b0b0f]/95 backdrop-blur-3xl border-b border-white/5 p-4 flex flex-col gap-4 shrink-0 z-50">
          <div className="flex items-center gap-4">
            {/* Control Group */}
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/5 text-white/40">
                <X size={18} />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={handleBack} disabled={historyIndex === 0} className="rounded-full hover:bg-white/5 disabled:opacity-20">
                <ChevronLeft size={20} className="text-white" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={handleForward} disabled={historyIndex === history.length - 1} className="rounded-full hover:bg-white/5 disabled:opacity-20">
                <ChevronRight size={20} className="text-white" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={handleReload} className="rounded-full hover:bg-white/5">
                <RefreshCw size={16} className={cn("text-white/60", isLoading && "animate-spin")} />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={handleHome} className="rounded-full hover:bg-white/5">
                <Home size={18} className="text-white/60" />
              </Button>
            </div>

            {/* Glassmorphism Search Bar */}
            <form onSubmit={handleSubmit} className="flex-1">
              <motion.div 
                animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                className="relative group"
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors">
                  {safetyStatus === 'BLOCKED' ? <ShieldAlert size={16} className="text-red-500" /> : <Globe size={16} />}
                </div>
                <Input 
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="Search knowledge or enter neural URL..."
                  className={cn(
                    "w-full h-11 bg-white/[0.04] border-white/5 rounded-full pl-11 pr-10 text-xs font-medium transition-all focus-visible:ring-primary/40 focus-visible:bg-white/[0.08] focus-visible:border-primary/20",
                    safetyStatus === 'BLOCKED' && "border-red-500/50 text-red-500"
                  )}
                />
                {inputUrl && (
                  <button 
                    type="button"
                    onClick={() => setInputUrl('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </motion.div>
            </form>

            {/* Neural Stability Monitor */}
            <div className="flex items-center gap-6 pr-2">
              <div className="hidden sm:flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">Stability</span>
                  <Badge variant="outline" className={cn(
                    "text-[8px] font-black uppercase px-2 py-0 rounded-full border-none",
                    safetyStatus === 'SAFE' ? "bg-green-500/10 text-green-400" :
                    safetyStatus === 'WARN' ? "bg-amber-500/10 text-amber-400" :
                    "bg-red-500/10 text-red-400"
                  )}>
                    {safetyStatus}
                  </Badge>
                </div>
                <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: `${guardianScore}%` }}
                    className={cn(
                      "h-full transition-all duration-1000",
                      guardianScore > 70 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : 
                      guardianScore > 30 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" : 
                      "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]"
                    )}
                  />
                </div>
              </div>
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border border-white/5",
                safetyStatus === 'SAFE' ? "bg-green-500/10 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]" : 
                safetyStatus === 'WARN' ? "bg-amber-500/10 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]" :
                "bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              )}>
                {safetyStatus === 'SAFE' ? <ShieldCheck size={20} /> : 
                 safetyStatus === 'WARN' ? <Shield size={20} /> : 
                 <ShieldAlert size={20} />}
              </div>
            </div>
          </div>

          {/* Quick Access Matrix */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[8px] font-black uppercase text-white/20 tracking-widest mr-2 shrink-0">Neural Links</span>
            {QUICK_ACCESS.map((item) => (
              <motion.button
                key={item.name}
                type="button"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateTo(item.url)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/5 text-[9px] font-bold text-white/50 hover:text-white transition-all shrink-0"
              >
                <item.icon size={12} className="text-primary/70" />
                {item.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Viewport with Non-Intrusive Stabilizers */}
        <div className="flex-1 relative bg-white overflow-hidden flex flex-col">
          {/* Environment Scan Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-transparent z-[60] overflow-hidden">
             <AnimatePresence>
               {isLoading && (
                 <motion.div 
                   initial={{ x: '-100%' }}
                   animate={{ x: '100%' }}
                   transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                   className="w-1/3 h-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
                 />
               )}
             </AnimatePresence>
          </div>

          <div className="flex-1 relative">
            {/* Real Viewport Content - ALWAYS VISIBLE */}
            <iframe 
              src={url} 
              className={cn(
                "w-full h-full border-none transition-all duration-1000 bg-white",
                isBlurActive && "blur-[8px] grayscale-[0.2]"
              )}
              title="Discipline Browser Viewport"
            />
            
            {/* Non-Blocking Floating Notification for Risk Warnings */}
            <AnimatePresence>
              {safetyStatus !== 'SAFE' && (
                <motion.div 
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  className="absolute top-6 right-6 z-[60] w-72 p-5 bg-[#0b0b0f]/90 backdrop-blur-2xl border border-amber-500/20 rounded-[1.5rem] shadow-2xl flex flex-col gap-4"
                >
                   <div className="flex items-start gap-4">
                     <div className={cn(
                       "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                       safetyStatus === 'BLOCKED' ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                     )}>
                       {safetyStatus === 'BLOCKED' ? <ShieldAlert size={20} /> : <AlertTriangle size={20} />}
                     </div>
                     <div className="flex-1">
                       <h4 className="text-xs font-bold text-white mb-1">Neural Fog Active</h4>
                       <p className="text-[10px] text-white/50 leading-relaxed font-medium">
                         {blockReason || "This environment is flagged as a high distraction risk. Stabilization protocols are active."}
                       </p>
                     </div>
                   </div>
                   <div className="flex items-center gap-2">
                     <Button 
                      type="button"
                      size="sm"
                      onClick={() => navigateTo('https://www.wikipedia.org')}
                      className="flex-1 h-9 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px]"
                     >
                       Knowledge Hub
                     </Button>
                     <Button 
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsBlurActive(false)}
                      className="h-9 rounded-lg text-white/40 hover:text-white hover:bg-white/5 text-[10px]"
                     >
                       Ignore
                     </Button>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Browser Footer HUD */}
        <div className="bg-[#0b0b0f] border-t border-white/5 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase text-white/20 tracking-widest">
              <Lock size={12} className="text-green-500/50" /> 256-Bit Neural Encryption
            </div>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase text-white/20 tracking-widest">
              <Sparkles size={12} className="text-amber-500/50" /> Protocol Integrity High
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-[9px] font-black uppercase text-primary/40 tracking-tight flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
               Streak Level {Math.floor(streak / 7)} Active
             </div>
             <div className="w-px h-3 bg-white/10" />
             <div className="text-[9px] font-black uppercase text-white/20">
               Neural Session v2.5
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
