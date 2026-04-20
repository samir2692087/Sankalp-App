
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
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
  ArrowLeft,
  Globe
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { assessContentSafety, filterSearchQuery, formatBrowserInput } from '@/lib/guardian-engine';
import { useRouter } from 'next/navigation';
import { getStoredData } from '@/lib/storage';

const QUICK_ACCESS = [
  { name: 'Wikipedia', icon: BookOpen, url: 'https://en.wikipedia.org' },
  { name: 'Scholar', icon: GraduationCap, url: 'https://scholar.google.com' },
  { name: 'Medium', icon: FileText, url: 'https://medium.com' },
  { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com' },
  { name: 'Docs', icon: SearchCode, url: 'https://nextjs.org/docs' }
];

const DEFAULT_HOMEPAGE = 'https://www.google.com';

export default function DisciplineBrowserPage() {
  const router = useRouter();
  const [streak, setStreak] = useState(0);
  const [url, setUrl] = useState(DEFAULT_HOMEPAGE);
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [safetyStatus, setSafetyStatus] = useState<'SAFE' | 'WARN' | 'BLOCKED'>('SAFE');
  const [guardianScore, setGuardianScore] = useState(100);
  const [blockReason, setBlockReason] = useState('');
  const [shake, setShake] = useState(false);
  const [isBlurActive, setIsBlurActive] = useState(false);
  
  const [history, setHistory] = useState<string[]>([DEFAULT_HOMEPAGE]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Auto-load homepage on mount
  useEffect(() => {
    const stored = getStoredData();
    setStreak(stored.currentStreak || 0);
    // Explicitly set the initial state to the homepage
    setUrl(DEFAULT_HOMEPAGE);
    setInputUrl(DEFAULT_HOMEPAGE);
  }, []);

  const navigateTo = useCallback((target: string, addToHistory = true) => {
    // 1. Mandatory Fallback: Never load empty or relative routes
    const scrubbedInput = (target || '').trim();
    if (!scrubbedInput || scrubbedInput === '/browser') {
      console.log("Loading: Falling back to homepage due to invalid input.");
      setUrl(DEFAULT_HOMEPAGE);
      setInputUrl(DEFAULT_HOMEPAGE);
      return;
    }
    
    setIsLoading(true);
    
    // 2. Intelligent Routing
    const filtered = filterSearchQuery(scrubbedInput);
    const finalUrl = formatBrowserInput(filtered);
    
    // 3. Debug Logging
    console.log("Loading:", finalUrl);

    // 4. Content Assessment
    const assessment = assessContentSafety(finalUrl, streak);

    // 5. Update UI Stability
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

    // Simulation of scanning environment
    setTimeout(() => setIsLoading(false), 1000);
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
  const handleHome = () => navigateTo(DEFAULT_HOMEPAGE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      navigateTo(inputUrl);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#07070a] overflow-hidden text-white selection:bg-primary/30">
      {/* Browser HUD Header */}
      <div className="bg-[#0b0b0f]/95 backdrop-blur-3xl border-b border-white/5 p-4 flex flex-col gap-3 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/')} 
            className="rounded-xl hover:bg-white/5 text-white/40"
          >
            <ArrowLeft size={18} />
          </Button>

          {/* Nav Controls */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleBack} disabled={historyIndex === 0} className="rounded-xl hover:bg-white/5 disabled:opacity-10">
              <ChevronLeft size={18} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleForward} disabled={historyIndex === history.length - 1} className="rounded-xl hover:bg-white/5 disabled:opacity-10">
              <ChevronRight size={18} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleReload} className="rounded-xl hover:bg-white/5">
              <RefreshCw size={14} className={cn("text-white/40", isLoading && "animate-spin")} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleHome} className="rounded-xl hover:bg-white/5">
              <Home size={16} className="text-white/40" />
            </Button>
          </div>

          {/* Search/URL Hub */}
          <form onSubmit={handleSubmit} className="flex-1">
            <motion.div 
              animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
              className="relative group"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
                {safetyStatus === 'BLOCKED' ? <ShieldAlert size={14} className="text-red-500" /> : <Globe size={14} />}
              </div>
              <Input 
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Search knowledge or enter neural URL..."
                className={cn(
                  "w-full h-11 bg-white/[0.03] border-white/5 rounded-2xl pl-11 pr-10 text-[11px] font-medium transition-all focus-visible:ring-primary/40 focus-visible:bg-white/[0.06] focus-visible:border-primary/20",
                  safetyStatus === 'BLOCKED' && "border-red-500/50 text-red-500"
                )}
              />
              {inputUrl && (
                <button 
                  type="button"
                  onClick={() => setInputUrl('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 hover:text-white transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </motion.div>
          </form>

          {/* Stability Hub */}
          <div className="flex items-center gap-4 pr-1">
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Neural Stability</span>
                <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: `${guardianScore}%` }}
                    className={cn(
                      "h-full transition-all duration-1000",
                      guardianScore > 70 ? "bg-green-500" : 
                      guardianScore > 30 ? "bg-amber-500" : "bg-red-500"
                    )}
                  />
                </div>
             </div>
             <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center border border-white/5",
              safetyStatus === 'SAFE' ? "bg-green-500/10 text-green-500" : 
              safetyStatus === 'WARN' ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
            )}>
              {safetyStatus === 'SAFE' ? <ShieldCheck size={18} /> : 
               safetyStatus === 'WARN' ? <Shield size={18} /> : <ShieldAlert size={18} />}
            </div>
          </div>
        </div>

        {/* Quick Access Matrix */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[8px] font-black uppercase text-white/10 tracking-widest mr-2 shrink-0">Neural Links</span>
          {QUICK_ACCESS.map((item) => (
            <motion.button
              key={item.name}
              type="button"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.06)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateTo(item.url)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-[9px] font-bold text-white/30 hover:text-white transition-all shrink-0"
            >
              <item.icon size={11} className="text-primary/50" />
              {item.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative bg-white overflow-hidden">
        {/* Top Scan Bar */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-transparent z-[60] overflow-hidden">
           <AnimatePresence>
             {isLoading && (
               <motion.div 
                 initial={{ x: '-100%' }}
                 animate={{ x: '100%' }}
                 transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                 className="w-1/4 h-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
               />
             )}
           </AnimatePresence>
        </div>

        {/* Browser Iframe */}
        {url && (
          <iframe 
            src={url} 
            className={cn(
              "w-full h-full border-none transition-all duration-700 bg-white",
              isBlurActive && "blur-[6px] grayscale-[0.3]"
            )}
            title="Discipline Viewport"
            onLoad={() => setIsLoading(false)}
          />
        )}

        {/* Floating Safety Pill - Non-Blocking */}
        <AnimatePresence>
          {safetyStatus !== 'SAFE' && (
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-[70]"
            >
               <div className={cn(
                 "px-6 py-2.5 rounded-full flex items-center gap-3 backdrop-blur-3xl border shadow-2xl transition-all",
                 safetyStatus === 'BLOCKED' ? "bg-red-950/90 border-red-500/40" : "bg-amber-950/90 border-amber-500/40"
               )}>
                 <div className={cn(
                   "w-6 h-6 rounded-full flex items-center justify-center",
                   safetyStatus === 'BLOCKED' ? "bg-red-500 text-white" : "bg-amber-500 text-white"
                 )}>
                   <ShieldAlert size={12} className={cn(safetyStatus === 'BLOCKED' && "animate-pulse")} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-tight leading-none text-white">Focus Stability Compromised</span>
                    <span className="text-[8px] font-bold text-white/50 leading-none mt-1">{blockReason}</span>
                 </div>
                 <div className="h-4 w-px bg-white/10 mx-1" />
                 <Button 
                   size="sm" 
                   variant="ghost" 
                   onClick={() => navigateTo(DEFAULT_HOMEPAGE)}
                   className="h-7 px-3 rounded-lg text-[9px] font-black uppercase text-primary hover:bg-white/5"
                 >
                   Stabilize
                 </Button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle Bottom Shield indicator */}
        <div className="absolute bottom-6 left-6 pointer-events-none z-50">
           <div className="flex items-center gap-2 opacity-20">
             <Lock size={12} className="text-green-500" />
             <span className="text-[9px] font-black uppercase tracking-[0.2em]">Neural Shield Active</span>
           </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="bg-[#0b0b0f] border-t border-white/5 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" /> Protocol Secure
           </div>
           <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">
             <Activity size={12} className="text-primary/50" /> Synchronization High
           </div>
        </div>
        <div className="text-[9px] font-black uppercase text-white/10 tracking-widest">
          IronWill Neural Engine v3.0
        </div>
      </div>
    </div>
  );
}

function Activity({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
