
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileJson, FileText, FileSpreadsheet, FileBox } from 'lucide-react';
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-headline text-center">Export Your Progress</DialogTitle>
          <DialogDescription className="text-center">Choose your preferred format for reporting or backup.</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-6">
          <Button variant="outline" onClick={handleJSON} className="h-24 flex flex-col gap-2 rounded-2xl neu-button border-none">
            <FileJson className="text-blue-500" />
            <span>JSON</span>
          </Button>
          <Button variant="outline" onClick={() => exportToCSV(data)} className="h-24 flex flex-col gap-2 rounded-2xl neu-button border-none">
            <FileSpreadsheet className="text-green-500" />
            <span>CSV</span>
          </Button>
          <Button variant="outline" onClick={() => exportToText(data)} className="h-24 flex flex-col gap-2 rounded-2xl neu-button border-none">
            <FileText className="text-primary" />
            <span>Text</span>
          </Button>
          <Button variant="outline" onClick={() => exportToPDF(data)} className="h-24 flex flex-col gap-2 rounded-2xl neu-button border-none">
            <FileBox className="text-red-500" />
            <span>PDF</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
