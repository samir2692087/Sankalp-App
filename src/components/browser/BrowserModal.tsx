"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
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
  BookOpen,
  Youtube,
  GraduationCap,
  FileText,
  SearchCode,
  ArrowRight
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

const PLACEHOLDERS = [
  "Search knowledge...",
  "Build discipline...",
  "Stay focused...",
  "Neural mastery search...",
  "Master your mind..."
];

const QUICK_ACCESS = [
  { name: 'Wikipedia', icon: BookOpen, url: 'https://en.wikipedia.org' },
  { name: 'Scholar', icon: GraduationCap, url: 'https://scholar.google.com' },
  { name: 'Medium', icon: FileText, url: 'https://medium.com' },
  { name: 'YouTube (Safe)', icon: Youtube, url: 'https://www.youtube.com' },
  { name: 'Docs', icon: SearchCode, url: 'https://nextjs.org/docs' }
];

export default function BrowserModal({ isOpen, onClose, streak }: BrowserModalProps) {
  const { toast } = useToast();
  const [url, setUrl] = useState('https://www.wikipedia.org');
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [safetyStatus, setSafetyStatus] = useState<'SAFE' | 'WARN' | 'BLOCKED'>('SAFE');
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME'>('LOW');
  const [guardianScore, setGuardianScore] = useState(100);
  const [blockReason, setBlockReason] = useState('');
  const [shake, setShake] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = useCallback((target: string) => {
    if (!target) return;
    
    setIsLoading(true);
    const scrubbed = filterSearchQuery(target);
    const assessment = assessContentSafety(scrubbed, streak);

    if (assessment.isBlocked || assessment.riskLevel === 'EXTREME') {
      setSafetyStatus('BLOCKED');
      setGuardianScore(0);
      setBlockReason(assessment.reason);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setIsLoading(false);
      return;
    }

    setRiskLevel(assessment.riskLevel);

    if (assessment.riskLevel === 'HIGH') {
      setSafetyStatus('BLOCKED'); // Emergency block
      setGuardianScore(30);
      setBlockReason(assessment.reason);
      setIsLoading(false);
      return;
    }

    if (assessment.riskLevel === 'MEDIUM') {
      setSafetyStatus('WARN');
      setGuardianScore(65);
    } else {
      setSafetyStatus('SAFE');
      setGuardianScore(100);
    }

    const finalUrl = formatBrowserInput(scrubbed);
    setUrl(finalUrl);
    setTimeout(() => setIsLoading(false), 1500); // Simulate neural scan
  }, [streak]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNavigate(inputUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[92vh] p-0 overflow-hidden bg-[#07070a] border-white/5 rounded-[3rem] shadow-[0_0_120px_rgba(0,0,0,0.9)] flex flex-col pointer-events-auto outline-none">
        <div className="sr-only">
          <DialogTitle>Discipline Browser Neural HUD</DialogTitle>
        </div>

        {/* Browser Top Bar - HUD Style */}
        <div className="bg-[#0b0b0f]/95 backdrop-blur-3xl border-b border-white/5 p-6 flex flex-col gap-5 shrink-0 z-50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-2xl hover:bg-white/5 transition-all w-10 h-10">
                <X size={20} className="text-white/40" />
              </Button>
              <div className="flex gap-1.5 ml-1">
                <div className="w-2 h-2 rounded-full bg-red-500/40 border border-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-amber-500/40 border border-amber-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/40 border border-green-500/50" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-3">
              <motion.div 
                animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                className="relative flex-1 group"
              >
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors">
                  <Globe size={18} />
                </div>
                <Input 
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder={PLACEHOLDERS[placeholderIndex]}
                  className={cn(
                    "w-full h-14 bg-white/[0.03] border-white/5 rounded-[1.5rem] pl-14 pr-12 text-sm font-medium transition-all focus-visible:ring-primary/40 focus-visible:bg-white/[0.06] focus-visible:border-primary/20",
                    safetyStatus === 'BLOCKED' && "border-red-500/50 text-red-500"
                  )}
                />
                <button 
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                >
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            </form>

            <div className="flex items-center gap-6 pr-2">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Neural Stability</span>
                  <Badge variant="outline" className={cn(
                    "text-[8px] font-black uppercase px-2 py-0.5 rounded-full border-none",
                    safetyStatus === 'SAFE' ? "bg-green-500/10 text-green-400" :
                    safetyStatus === 'WARN' ? "bg-amber-500/10 text-amber-400" :
                    "bg-red-500/10 text-red-400"
                  )}>
                    {safetyStatus}
                  </Badge>
                </div>
                <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${guardianScore}%` }}
                    className={cn(
                      "h-full transition-all duration-1000",
                      guardianScore > 70 ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" : 
                      guardianScore > 30 ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]" : 
                      "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]"
                    )}
                  />
                </div>
              </div>
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border border-white/5",
                safetyStatus === 'SAFE' ? "bg-green-500/10 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]" : 
                safetyStatus === 'WARN' ? "bg-amber-500/10 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]" :
                "bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
              )}>
                {safetyStatus === 'SAFE' ? <ShieldCheck size={24} /> : 
                 safetyStatus === 'WARN' ? <Shield size={24} /> : 
                 <ShieldAlert size={24} />}
              </div>
            </div>
          </div>

          {/* Quick Access Panel */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            {QUICK_ACCESS.map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigate(item.url)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/5 text-[10px] font-bold text-white/50 hover:text-white transition-all shrink-0"
              >
                <item.icon size={14} className="text-primary/70" />
                {item.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Browser Viewport */}
        <div className="flex-1 relative bg-white overflow-hidden">
          <AnimatePresence mode="wait">
            {safetyStatus === 'BLOCKED' ? (
              <motion.div 
                key="blocked"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="absolute inset-0 z-[60] bg-[#07070a] flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-28 h-28 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center text-red-500 mb-10 border border-red-500/20 shadow-[0_0_60px_rgba(239,68,68,0.2)]">
                  <ShieldAlert size={56} className="animate-pulse" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4 font-headline tracking-tight">Neural Protocol Violation</h2>
                <p className="text-white/50 max-w-md mb-12 leading-relaxed font-medium text-lg">
                  {blockReason || "This search is not aligned with your discipline mastery protocols. The Guardian has intercepted the request to preserve your streak."}
                </p>
                <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
                  <Button 
                    onClick={() => { setSafetyStatus('SAFE'); handleNavigate('https://www.wikipedia.org'); }}
                    className="h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest shadow-xl shadow-primary/20"
                  >
                    Return to Safe Zone
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={onClose}
                    className="h-16 rounded-2xl text-white/30 hover:text-white hover:bg-white/5"
                  >
                    Terminate Session
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="viewport"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full relative"
              >
                <iframe 
                  src={url} 
                  className={cn(
                    "w-full h-full border-none transition-all duration-700",
                    safetyStatus === 'WARN' && "blur-[12px] grayscale-[0.5] pointer-events-none"
                  )}
                  title="Discipline Browser Viewport"
                />
                
                {/* HUD Overlay for Warnings */}
                {safetyStatus === 'WARN' && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px] flex flex-col items-center justify-center p-12 text-center z-50">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-[#0b0b0f] border border-amber-500/30 p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 max-w-sm"
                    >
                       <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
                         <AlertTriangle size={32} />
                       </div>
                       <div>
                         <h3 className="text-xl font-bold text-white mb-2">High Distraction Potential</h3>
                         <p className="text-sm text-white/50 leading-relaxed">The Guardian has flagged this environment as a distraction risk. Neural Stabilizers are active.</p>
                       </div>
                       <Button 
                        onClick={() => { setSafetyStatus('SAFE'); handleNavigate('https://www.wikipedia.org'); }}
                        className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold"
                       >
                         Redirect to Wikipedia
                       </Button>
                    </motion.div>
                  </div>
                )}

                {/* Loading State Overlay */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#07070a]/90 backdrop-blur-xl flex flex-col items-center justify-center z-[55]"
                    >
                      <div className="flex gap-4 mb-8">
                        {[0, 0.2, 0.4].map((delay) => (
                          <motion.div 
                            key={delay}
                            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3], y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay }}
                            className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_rgba(124,58,237,0.8)]" 
                          />
                        ))}
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[12px] font-black uppercase tracking-[0.5em] text-white">Neural Scanning</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary/60">Verifying Digital Integrity</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Browser Footer - HUD Style */}
        <div className="bg-[#0b0b0f] border-t border-white/5 p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2.5 text-[10px] font-black uppercase text-white/30 tracking-widest">
              <Lock size={12} className="text-green-500/50" /> 256-Bit Encrypted Session
            </div>
            <div className="flex items-center gap-2.5 text-[10px] font-black uppercase text-white/30 tracking-widest">
              <Sparkles size={12} className="text-amber-500/50" /> Guardian v4.0 Precision
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-[9px] font-black uppercase text-primary/40 tracking-tight flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
               Neural Stability Verified
             </div>
             <div className="w-px h-4 bg-white/10" />
             <div className="text-[9px] font-black uppercase text-white/20">
               Session: {Math.random().toString(36).substring(7).toUpperCase()}
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
