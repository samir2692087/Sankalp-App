"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldAlert, 
  X, 
  Search, 
  Lock, 
  Sparkles,
  Shield,
  AlertTriangle,
  Home,
  BookOpen,
  GraduationCap,
  Youtube,
  SearchCode,
  FileText,
  ArrowLeft,
  Globe,
  Zap,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';
import { assessContentSafety } from '@/lib/guardian-engine';
import { useRouter } from 'next/navigation';
import { getStoredData } from '@/lib/storage';

const QUICK_ACCESS = [
  { name: 'Wikipedia', icon: BookOpen, url: 'https://en.wikipedia.org' },
  { name: 'Scholar', icon: GraduationCap, url: 'https://scholar.google.com' },
  { name: 'Medium', icon: FileText, url: 'https://medium.com' },
  { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com' },
  { name: 'Docs', icon: SearchCode, url: 'https://nextjs.org/docs' }
];

export default function DisciplineBrowserPage() {
  const router = useRouter();
  const [streak, setStreak] = useState(0);
  const [inputUrl, setInputUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<any>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const stored = getStoredData();
    setStreak(stored.currentStreak || 0);
  }, []);

  const processLaunch = useCallback((target: string) => {
    const scrubbedInput = (target || '').trim();
    if (!scrubbedInput) return;

    setIsAnalyzing(true);
    
    const isProbablyUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(scrubbedInput) && !scrubbedInput.includes(' ');
    let finalUrl = '';
    if (isProbablyUrl) {
      finalUrl = scrubbedInput.startsWith('http') ? scrubbedInput : `https://${scrubbedInput}`;
    } else {
      finalUrl = `https://www.google.com/search?q=${encodeURIComponent(scrubbedInput)}&safe=active`;
    }

    const assessment = assessContentSafety(finalUrl, streak);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      if (assessment.status === 'SAFE') {
        window.open(finalUrl, '_blank');
        setInputUrl('');
      } else {
        setPendingUrl(finalUrl);
        setRiskAssessment(assessment);
        setShowWarning(true);
      }
    }, 800);
  }, [streak]);

  const confirmLaunch = () => {
    if (pendingUrl) {
      window.open(pendingUrl, '_blank');
      resetLaunch();
    }
  };

  const resetLaunch = () => {
    setPendingUrl(null);
    setRiskAssessment(null);
    setShowWarning(false);
    setInputUrl('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processLaunch(inputUrl);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#07070a] overflow-hidden text-white selection:bg-primary/30">
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

          <form onSubmit={handleSubmit} className="flex-1">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
                <Search size={16} />
              </div>
              <Input 
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter URL or search knowledge..."
                className="w-full h-12 bg-white/[0.03] border-white/5 rounded-2xl pl-11 pr-10 text-sm font-medium transition-all focus-visible:ring-primary/40 focus-visible:bg-white/[0.06] focus-visible:border-primary/20"
              />
              {isAnalyzing && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Zap size={14} className="text-primary animate-pulse" />
                </div>
              )}
            </div>
          </form>

          <div className="flex items-center gap-3">
             <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Protection</span>
                <div className="w-16 h-1 bg-green-500/20 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                </div>
             </div>
             <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 bg-green-500/10 text-green-500">
                <ShieldCheck size={18} />
             </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-y-auto no-scrollbar p-6 sm:p-12 flex flex-col items-center">
        <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full flex flex-col items-center gap-12 pt-12"
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary mb-4">
              <Sparkles size={12} /> Focus Launchpad Active
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold font-headline leading-tight">
              Browse with <span className="text-primary">Intent.</span>
            </h2>
            <p className="text-white/40 text-sm sm:text-base font-medium max-w-md mx-auto">
              Every search is analyzed for focus integrity. SafeSearch is forced by default.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {QUICK_ACCESS.map((item, idx) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => processLaunch(item.url)}
                className="group glass-card p-6 rounded-[2rem] flex items-center gap-4 border border-white/5 hover:border-primary/30 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-white/40 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                  <item.icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white/80 group-hover:text-white">{item.name}</h4>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Safe Zone</p>
                </div>
                <ExternalLink size={14} className="ml-auto text-white/10 group-hover:text-white/40" />
              </motion.button>
            ))}
          </div>

          <div className="w-full glass-card p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] flex flex-col sm:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
               <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin-slow" />
               <Zap size={32} className="text-primary drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-bold mb-2">Focus Stability High</h3>
              <p className="text-sm text-white/40 font-medium leading-relaxed">
                You are currently browsing under Level {Math.floor(streak / 7)} protection. Distraction patterns are monitored in real-time.
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-white/20 tracking-tighter">
                  <span>Integrity</span>
                  <span>98%</span>
                </div>
                <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <div className="w-[98%] h-full bg-primary" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showWarning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md w-full glass-card p-8 rounded-[3rem] border border-red-500/20 bg-[#0b0b0f] shadow-[0_0_100px_rgba(239,68,68,0.1)]"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-6 mx-auto">
                <ShieldAlert size={32} className="animate-pulse" />
              </div>
              
              <div className="text-center space-y-4 mb-8">
                <h3 className="text-2xl font-bold text-red-500">Protocol Alert</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  The destination you are attempting to reach has been flagged for <span className="text-white font-bold">{riskAssessment?.reason}</span>.
                </p>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3 text-left">
                  <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                  <p className="text-[10px] font-medium text-white/40 italic">
                    "Discipline is choosing between what you want now and what you want most."
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => processLaunch('https://www.wikipedia.org')}
                  className="h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold"
                >
                  Redirect to Knowledge Hub
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="ghost" 
                    onClick={resetLaunch}
                    className="h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60"
                  >
                    Abort Launch
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={confirmLaunch}
                    className="h-12 rounded-2xl text-red-500 hover:bg-red-500/10"
                  >
                    Proceed Anyway
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#0b0b0f] border-t border-white/5 px-8 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Secure Connection
           </div>
           <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">
             <Globe size={12} className="text-primary/50" /> Focus VPN Active
           </div>
        </div>
        <div className="text-[9px] font-black uppercase text-white/10 tracking-widest">
          Guardian Stable
        </div>
      </div>
    </div>
  );
}
