
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
import { FileJson, FileText, FileSpreadsheet, FileBox, Trophy, Shield, Flame, Activity, ArrowLeft, Upload } from 'lucide-react';
import { UserData } from "@/lib/types";
import { exportToCSV, exportToText, exportToPDF } from "@/lib/export-utils";
import { importData } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: UserData;
  onDataImport: () => void;
}

export default function ExportModal({ isOpen, onClose, data, onDataImport }: ExportModalProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleJSONExport = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ironwill-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "Backup Created", description: "JSON snapshot saved to your device." });
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
          toast({ title: "Protocol Restored", description: "All discipline data has been successfully imported." });
          onDataImport();
          onClose();
        } else {
          toast({ variant: "destructive", title: "Import Failed", description: "The backup file is invalid or corrupted." });
        }
      }
    };
    reader.readAsText(file);
  };

  const stats = [
    { label: 'Current Streak', val: `${data.currentStreak} Days`, icon: Flame, color: 'text-orange-500' },
    { label: 'Personal Best', val: `${data.bestStreak} Days`, icon: Trophy, color: 'text-yellow-500' },
    { label: 'Urges Resisted', val: data.urges.length, icon: Shield, color: 'text-blue-500' },
    { label: 'Relapses Logged', val: data.relapses.length, icon: Activity, color: 'text-red-500' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card sm:max-w-[550px] rounded-[3.5rem] border-none shadow-2xl p-0 overflow-hidden outline-none">
        <div className="bg-primary/10 p-10 text-center border-b border-white/5 relative">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="absolute left-6 top-10 p-0 h-auto hover:bg-transparent hidden sm:flex"
          >
            <ArrowLeft size={24} />
          </Button>
          
          <DialogTitle className="text-3xl font-bold font-headline mb-2">Export Center</DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">Archive your discipline journey for local backup or review.</DialogDescription>
        </div>
        
        <div className="p-8 sm:p-10 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, idx) => (
              <div key={idx} className="neu-inset p-4 rounded-2xl flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-card shadow-sm ${s.color}`}>
                  <s.icon size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground leading-none mb-1">{s.label}</p>
                  <p className="text-lg font-bold font-headline leading-none">{s.val}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Select Report Format</h4>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => exportToPDF(data)} className="h-24 flex flex-col gap-2 rounded-3xl neu-button border-none group">
                <FileBox className="text-red-500 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm">PDF Summary</span>
              </Button>
              <Button onClick={() => exportToCSV(data)} className="h-24 flex flex-col gap-2 rounded-3xl neu-button border-none group">
                <FileSpreadsheet className="text-green-500 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm">CSV Ledger</span>
              </Button>
              <Button onClick={() => exportToText(data)} className="h-24 flex flex-col gap-2 rounded-3xl neu-button border-none group">
                <FileText className="text-primary group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm">Text Report</span>
              </Button>
              <Button onClick={handleJSONExport} className="h-24 flex flex-col gap-2 rounded-3xl neu-button border-none group">
                <FileJson className="text-blue-500 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm">JSON Backup</span>
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-muted">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".json"
              onChange={handleJSONImport}
            />
            <Button 
              variant="ghost" 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-14 rounded-2xl border-2 border-dashed border-muted hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-3 font-bold text-muted-foreground hover:text-primary"
            >
              <Upload size={20} />
              Restore Protocol from Backup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
