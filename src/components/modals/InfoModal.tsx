
"use client";

import { useLanguage } from '@/context/LanguageContext';
import { Info, ShieldCheck, FileText, Mail, Trash2 } from 'lucide-react';
import SankalpIcon from '@/components/icons/SankalpIcon';
import PortalSheet from "@/components/ui/portal-sheet";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteData: () => void;
}

export default function InfoModal({ isOpen, onClose, onDeleteData }: InfoModalProps) {
  const { t } = useLanguage();

  const sections = [
    { id: 'about', title: t('about_app'), content: t('about_content'), icon: Info, color: 'text-primary' },
    { id: 'privacy', title: t('privacy_policy'), content: t('privacy_content'), icon: ShieldCheck, color: 'text-green-500' },
    { id: 'terms', title: t('terms_of_use'), content: t('terms_content'), icon: FileText, color: 'text-blue-500' },
    { id: 'contact', title: t('contact_us'), content: t('contact_content'), icon: Mail, color: 'text-amber-500' },
  ];

  return (
    <PortalSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t('legal_info')}
      description={t('legal_desc')}
    >
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_40px_rgba(168,85,247,0.1)]">
            <SankalpIcon className="text-primary" size={40} />
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {sections.map((section) => (
            <AccordionItem 
              key={section.id} 
              value={section.id}
              className="border border-white/5 bg-white/[0.02] rounded-[1.8rem] px-5 transition-all data-[state=open]:bg-white/[0.04]"
            >
              <AccordionTrigger className="hover:no-underline py-5">
                <div className="flex items-center gap-4 text-left">
                  <div className={`p-2.5 rounded-xl bg-white/5 ${section.color}`}>
                    <section.icon size={18} />
                  </div>
                  <span className="font-bold text-sm tracking-tight">{section.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-xs leading-relaxed text-white/50 font-medium">
                {section.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="pt-6 border-t border-white/5">
          <Button 
            variant="ghost" 
            onClick={onDeleteData}
            className="w-full h-18 rounded-[1.8rem] flex items-center gap-5 px-5 hover:bg-red-500/10 text-red-500 group border border-transparent hover:border-red-500/20"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
              <Trash2 size={22} />
            </div>
            <div className="text-left flex-1">
              <p className="font-bold text-sm">{t('delete_data')}</p>
              <p className="text-red-500/30 text-[9px] uppercase font-black tracking-widest mt-1">{t('reset')}</p>
            </div>
          </Button>
        </div>
        
        <div className="text-center opacity-20 pointer-events-none pb-4">
          <p className="text-[8px] font-black uppercase tracking-[0.4em]">{t('app_name')} v2.5.0</p>
        </div>
      </div>
    </PortalSheet>
  );
}
