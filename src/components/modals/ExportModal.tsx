"use client";

import { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileJson, FileText, FileSpreadsheet, FileBox, Trophy, Flame, Activity, ArrowLeft, Upload, Share2 } from 'lucide-react';
import SankalpIcon from '@/components/icons/SankalpIcon';
import { UserData } from "@/lib/types";
import { exportToCSV, exportToText, exportToPDF } from "@/lib/export-utils";
import { importData } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useLanguage } from '@/context/LanguageContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: UserData;
  onDataImport: () => void;
}

export default function ExportModal({ isOpen, onClose, data, onDataImport }: ExportModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleJSONExport = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sankalp-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: t('stay_steady'), description: "Backup saved successfully." });
  };

  const handleJSONImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        const success = importData(result);
        if (success) {
          toast({ title: t('victory'), description: "Protocol restored successfully." });
          onDataImport();
          onClose();
        } else {
          toast({ variant: "destructive", title: "Error", description: "Incompatible backup format." });
        }
      }
    };
    reader.readAsText(file);
  };

  const stats = [
    { label: t('streak'), val: `${data.currentStreak}D`, icon: Flame, color: 'text-orange-500' },
    { label: t('discipline_score'), val: data.disciplineScore, icon: SankalpIcon, color: 'text-blue-500' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card sm:max-w-[550px] max-h-[90vh] rounded-[3.5rem] border border-white/10 shadow-[0_0_60px_rgba(124,58,237,0.15)] p-0 overflow-hidden outline-none flex flex-col">
        <div className="bg-primary/10 p-8 text-center border-b border-white/5 relative shrink-0">
          <Button 
            type="button"
            variant="ghost" 
            onClick={onClose} 
            className="absolute left-6 top-8 p-0 h-auto hover:bg-transparent hidden sm:flex"
          >
            <ArrowLeft size={24} />
          </Button>
          <div className="w-14 h-14 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Share2 size={28} />
          </div>
          <DialogTitle className="text-2xl font-bold font-headline">{t('archive_center')}</DialogTitle>
          <DialogDescription className="text-muted-foreground/60 font-medium uppercase tracking-[0.2em] text-[8px] mt-1">{t('data_management')}</DialogDescription>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-10 no-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 p-5 rounded-3xl flex items-center gap-4">
                <div className={`p-2.5 rounded-xl bg-card shadow-sm ${s.color}`}>
                  <s.icon size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-muted-foreground opacity-60 leading-none mb-1.5">{s.label}</p>
                  <p className="text-xl font-bold font-headline leading-none">{s.val}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">{t('export_protocol')}</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: t('pdf_report'), icon: FileBox, color: 'text-red-400', action: () => exportToPDF(data) },
                { label: t('csv_ledger'), icon: FileSpreadsheet, color: 'text-green-400', action: () => exportToCSV(data) },
                { label: t('text_log'), icon: FileText, color: 'text-primary', action: () => exportToText(data) },
                { label: t('json_backup'), icon: FileJson, color: 'text-blue-400', action: handleJSONExport }
              ].map((item) => (
                <motion.button 
                  key={item.label}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={item.action} 
                  className="h-24 flex flex-col items-center justify-center gap-2 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
                >
                  <item.icon className={cn("size-6 transition-transform group-hover:scale-110", item.color)} />
                  <span className="font-bold text-[10px] uppercase tracking-tighter">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".json"
              onChange={handleJSONImport}
            />
            <Button 
              type="button"
              variant="ghost" 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-16 rounded-2xl border border-dashed border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-4 font-bold text-muted-foreground/80 hover:text-primary"
            >
              <Upload size={22} />
              {t('restore_logs')}
            </Button>
          </div>
          <div className="h-10" /> {/* Mobile safety spacer */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
