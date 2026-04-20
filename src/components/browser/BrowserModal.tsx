
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  ShieldCheck, 
  ShieldAlert, 
  X, 
  Search, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Lock, 
  Sparkles,
  ExternalLink,
  Brain
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { assessContentSafety, GuardianRiskAssessment } from '@/lib/guardian-engine';
import { analyzeSafety } from '@/ai/flows/guardian-analysis-flow';
import { useToast } from '@/hooks/use-toast';

interface BrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
}

export default function BrowserModal({ isOpen, onClose, streak }: BrowserModalProps) {
  const { toast } = useToast();
  const [url, setUrl] = useState('https://www.google.com/search?q=discipline+mastery');
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [guardianScore, setGuardianScore] = useState(100);
  const [riskAssessment, setRiskAssessment] = useState<GuardianRiskAssessment | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [safetyStatus, setSafetyStatus] = useState<'SAFE' | 'WARN' | 'BLOCKED'>('SAFE');

  const handleNavigate = async (target: string) => {
    if (!target) return;
    
    setLoading(true);
    const localCheck = assessContentSafety(target);
    setRiskAssessment(localCheck);

    if (localCheck.isBlocked) {
      setSafetyStatus('BLOCKED');
      setGuardianScore(0);
      setLoading(false);
      return;
    }

    setIsAiAnalyzing(true);
    try {
      const aiResponse = await analyzeSafety({ content: target, userStreak: streak });
      setGuardianScore(aiResponse.safetyScore);
      
      if (!aiResponse.isSafe) {
        setSafetyStatus('BLOCKED');
        setRiskAssessment({
          isBlocked: true,
          reason: aiResponse.recommendation,
          riskLevel: 'HIGH'
        });
      } else if (aiResponse.safetyScore < 70) {
        setSafetyStatus('WARN');
      } else {
        setSafetyStatus('SAFE');
        setUrl(target.startsWith('http') ? target : `https://www.google.com/search?q=${encodeURIComponent(target)}`);
      }
    } catch (e) {
      // Fallback to local check if AI fails
      setUrl(target.startsWith('http') ? target : `https://www.google.com/search?q=${encodeURIComponent(target)}`);
    } finally {
      setIsAiAnalyzing(false);
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNavigate(inputUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden bg-[#0a0a0f] border-white/5 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col pointer-events-auto">
        {/* Browser Top Bar */}
        <div className="bg-[#12121a]/80 backdrop-blur-xl border-b border-white/5 p-4 flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-white/5">
              <X size={20} className="text-white/40" />
            </Button>
            <div className="flex gap-1 ml-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                <Globe size={16} />
              </div>
              <Input 
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Secure Focus Search..."
                className="w-full h-12 bg-white/5 border-white/5 rounded-2xl pl-12 pr-12 text-sm font-medium focus-visible:ring-primary/20 focus-visible:bg-white/10 transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {isAiAnalyzing ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Brain size={16} className="text-primary" />
                  </motion.div>
                ) : (
                  <Search size={16} className="text-white/20" />
                )}
              </div>
            </div>
          </form>

          <div className="flex items-center gap-4 pr-2">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Guardian Protocol</span>
              <div className="flex items-center gap-2">
                 <Badge variant="outline" className={cn(
                   "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border-none",
                   safetyStatus === 'SAFE' ? "bg-green-500/10 text-green-400" :
                   safetyStatus === 'WARN' ? "bg-amber-500/10 text-amber-400" :
                   "bg-red-500/10 text-red-400"
                 )}>
                   {safetyStatus}
                 </Badge>
                 <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${guardianScore}%` }}
                      className={cn(
                        "h-full transition-all duration-1000",
                        guardianScore > 70 ? "bg-green-500" : guardianScore > 30 ? "bg-amber-500" : "bg-red-500"
                      )}
                    />
                 </div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              <ShieldCheck size={20} />
            </div>
          </div>
        </div>

        {/* Browser Content Area */}
        <div className="flex-1 relative bg-white">
          <AnimatePresence mode="wait">
            {safetyStatus === 'BLOCKED' ? (
              <motion.div 
                key="blocked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-[#0a0a0f] flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mb-8 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                  <ShieldAlert size={48} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 font-headline">Access Terminated</h2>
                <p className="text-white/60 max-w-md mb-10 leading-relaxed font-medium">
                  {riskAssessment?.reason || "The AI Guardian has detected a risk to your mastery. Protecting your streak is our primary protocol."}
                </p>
                <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
                  <Button 
                    onClick={() => { setSafetyStatus('SAFE'); handleNavigate('https://www.google.com/search?q=motivation'); }}
                    className="h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest"
                  >
                    Redirect to Growth
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={onClose}
                    className="h-14 rounded-2xl text-white/40 hover:text-white"
                  >
                    Abort Browsing Session
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="frame"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full relative"
              >
                <iframe 
                  src={url} 
                  className="w-full h-full border-none"
                  title="Discipline Browser Viewport"
                />
                
                {/* Simulated AI Layer Over Content */}
                {safetyStatus === 'WARN' && (
                  <div className="absolute inset-0 pointer-events-none backdrop-blur-[2px] bg-amber-500/5 flex items-start justify-center pt-20">
                    <Badge className="bg-amber-500 text-white shadow-2xl px-4 py-2 rounded-xl animate-pulse flex gap-2 items-center">
                      <ShieldAlert size={14} /> Attention: High Distraction Potential
                    </Badge>
                  </div>
                )}

                {loading && (
                  <div className="absolute inset-0 bg-[#0a0a0f]/80 backdrop-blur-md flex flex-col items-center justify-center">
                    <div className="flex gap-2 mb-4">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                        className="w-3 h-3 rounded-full bg-primary" 
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                        className="w-3 h-3 rounded-full bg-primary" 
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                        className="w-3 h-3 rounded-full bg-primary" 
                      />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Synchronizing Neural Shields</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Browser Footer Info */}
        <div className="bg-[#0a0a0f] border-t border-white/5 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/30">
              <Lock size={12} /> Encrypted Session
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/30">
              <Sparkles size={12} className="text-yellow-500" /> Premium Guardian Active
            </div>
          </div>
          <div className="text-[9px] font-black uppercase text-primary/50 tracking-tighter">
            Powered by IronWill Guardian Engine v3.0
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Dialog, DialogContent } from '@/components/ui/dialog';
