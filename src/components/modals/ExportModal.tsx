"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileJson, FileText, FileSpreadsheet, FileBox, Trophy, Shield, Flame, Activity } from 'lucide-react';
import { UserData } from "@/lib/types";
import { exportToCSV, exportToText, exportToPDF } from "@/lib/export-utils";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: UserData;
}

export default function ExportModal({ isOpen, onClose, data }: ExportModalProps) {
  const handleJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ironwill-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: 'Current Streak', val: `${data.currentStreak} Days`, icon: Flame, color: 'text-orange-500' },
    { label: 'Personal Best', val: `${data.bestStreak} Days`, icon: Trophy, color: 'text-yellow-500' },
    { label: 'Urges Resisted', val: data.urges.length, icon: Shield, color: 'text-blue-500' },
    { label: 'Relapses Logged', val: data.relapses.length, icon: Activity, color: 'text-red-500' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card sm:max-w-[550px] rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-primary/10 p-10 text-center border-b border-white/5">
          <DialogTitle className="text-3xl font-bold font-headline mb-2">Export Center</DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">Archive your discipline journey for local backup or review.</DialogDescription>
        </div>
        
        <div className="p-10 space-y-8">
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
              <Button onClick={() => exportToPDF(data)} className="h-20 flex flex-col gap-2 rounded-2xl neu-button border-none group">
                <FileBox className="text-red-500 group-hover:scale-110 transition-transform" />
                <span className="font-bold">PDF Summary</span>
              </Button>
              <Button onClick={() => exportToCSV(data)} className="h-20 flex flex-col gap-2 rounded-2xl neu-button border-none group">
                <FileSpreadsheet className="text-green-500 group-hover:scale-110 transition-transform" />
                <span className="font-bold">CSV Ledger</span>
              </Button>
              <Button onClick={() => exportToText(data)} className="h-20 flex flex-col gap-2 rounded-2xl neu-button border-none group">
                <FileText className="text-primary group-hover:scale-110 transition-transform" />
                <span className="font-bold">Text Report</span>
              </Button>
              <Button onClick={handleJSON} className="h-20 flex flex-col gap-2 rounded-2xl neu-button border-none group">
                <FileJson className="text-blue-500 group-hover:scale-110 transition-transform" />
                <span className="font-bold">JSON Backup</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}