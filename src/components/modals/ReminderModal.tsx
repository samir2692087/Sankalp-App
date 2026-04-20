
"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  enabled: boolean;
  time: string;
  onUpdate: (enabled: boolean, time: string) => void;
}

export default function ReminderModal({ isOpen, onClose, enabled, time, onUpdate }: ReminderModalProps) {
  const { toast } = useToast();
  const [localEnabled, setLocalEnabled] = useState(enabled);
  const [localTime, setLocalTime] = useState(time);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, [isOpen]);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Your browser doesn't support notifications."
      });
      return;
    }

    const permission = await Notification.requestPermission();
    setPermissionStatus(permission);
    
    if (permission === 'granted') {
      toast({
        title: "Access Granted",
        description: "You'll now receive discipline reminders."
      });
      setLocalEnabled(true);
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Please enable notifications in your browser settings."
      });
    }
  };

  const handleSave = () => {
    if (localEnabled && permissionStatus !== 'granted') {
      requestPermission();
      return;
    }
    onUpdate(localEnabled, localTime);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card sm:max-w-[425px] rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden outline-none">
        <div className="bg-primary/10 p-8 text-center border-b border-white/5 relative">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="absolute left-6 top-8 p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft size={24} />
          </Button>
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
            {localEnabled ? <Bell className="text-primary" size={32} /> : <BellOff className="text-muted-foreground" size={32} />}
          </div>
          <DialogTitle className="text-2xl font-bold font-headline">Reminder Center</DialogTitle>
          <DialogDescription className="mt-2">Set your daily protocol alert.</DialogDescription>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between p-4 rounded-2xl neu-inset">
            <div className="flex flex-col gap-1">
              <Label className="font-bold text-base">Active Reminder</Label>
              <p className="text-[10px] uppercase font-black text-muted-foreground">Daily Consistency Alert</p>
            </div>
            <Switch 
              checked={localEnabled} 
              onCheckedChange={setLocalEnabled}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className={`space-y-4 transition-all duration-300 ${localEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div className="space-y-2">
              <Label className="font-bold">Protocol Time</Label>
              <Input 
                type="time" 
                value={localTime} 
                onChange={(e) => setLocalTime(e.target.value)}
                className="h-14 rounded-xl neu-inset border-none text-xl font-bold font-headline px-6"
              />
            </div>

            {permissionStatus === 'denied' && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 text-destructive text-xs font-medium">
                <AlertCircle size={16} className="shrink-0" />
                <p>Notifications are blocked. Reset browser permissions to use this feature.</p>
              </div>
            )}
          </div>

          <Button 
            onClick={handleSave}
            className="w-full h-14 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <ShieldCheck className="mr-2" size={20} />
            Save Protocol
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
