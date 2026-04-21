"use client";

import { useLanguage } from '@/context/LanguageContext';
import { 
  Info, 
  ShieldCheck, 
  FileText, 
  Mail, 
  Trash2, 
  Calendar,
  Lock,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import SankalpIcon from '@/components/icons/SankalpIcon';
import PortalSheet from "@/components/ui/portal-sheet";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from 'framer-motion';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteData: () => void;
}

export default function InfoModal({ isOpen, onClose, onDeleteData }: InfoModalProps) {
  const { t } = useLanguage();

  const sections = [
    { 
      id: 'about', 
      title: t('about_app'), 
      icon: Info, 
      color: 'text-primary',
      content: (
        <div className="space-y-4">
          <p>{t('about_content_detailed')}</p>
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
            <UserCheck size={18} className="text-primary shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">{t('tagline')}</span>
          </div>
        </div>
      )
    },
    { 
      id: 'privacy', 
      title: t('privacy_policy'), 
      icon: ShieldCheck, 
      color: 'text-green-500',
      content: (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-white/40 mb-2">
            <Calendar size={12} />
            <span className="text-[9px] font-bold uppercase tracking-widest">{t('legal_effective_date')}</span>
          </div>
          
          <div className="space-y-4">
            <section>
              <h5 className="text-white font-bold text-xs mb-1 uppercase tracking-tight">{t('privacy_collection_title')}</h5>
              <p>{t('privacy_collection_content')}</p>
            </section>
            <section>
              <h5 className="text-white font-bold text-xs mb-1 uppercase tracking-tight">{t('privacy_local_title')}</h5>
              <p>{t('privacy_local_content')}</p>
            </section>
            <section>
              <h5 className="text-white font-bold text-xs mb-1 uppercase tracking-tight">{t('privacy_usage_title')}</h5>
              <p>{t('privacy_usage_content')}</p>
            </section>
            <section>
              <h5 className="text-white font-bold text-xs mb-1 uppercase tracking-tight">{t('privacy_sharing_title')}</h5>
              <p>{t('privacy_sharing_content')}</p>
            </section>
            <section>
              <h5 className="text-white font-bold text-xs mb-1 uppercase tracking-tight">{t('privacy_children_title')}</h5>
              <p>{t('privacy_children_content')}</p>
            </section>
            <section>
              <h5 className="text-white font-bold text-xs mb-1 uppercase tracking-tight">{t('privacy_control_title')}</h5>
              <p>{t('privacy_control_content')}</p>
            </section>
          </div>
          
          <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10 flex items-start gap-3">
            <Lock size={16} className="text-green-500 shrink-0 mt-0.5" />
            <p className="text-[10px] font-medium leading-relaxed italic opacity-80">{t('privacy_note')}</p>
          </div>
        </div>
      )
    },
    { 
      id: 'terms', 
      title: t('terms_of_use'), 
      icon: FileText, 
      color: 'text-blue-500',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <section>
              <h5 className="text-white font-bold text-xs mb-1 uppercase tracking-tight">{t('terms_purpose_title')}</h5>
              <p>{t('terms_purpose_content')}</p>
            </section>
            <section>
              <h5 className="text-white font-bold text-xs mb-1 uppercase tracking-tight">{t('terms_disclaimer_title')}</h5>
              <p className="text-amber-200/70">{t('terms_disclaimer_content')}</p>
            </section>
            <section>
              <h5 className="text-white font-bold text-xs mb-1 uppercase tracking-tight">{t('terms_liability_title')}</h5>
              <p>{t('terms_liability_content')}</p>
            </section>
            <section>
              <h5 className="text-white font-bold text-xs mb-1 uppercase tracking-tight">{t('terms_acceptance_title')}</h5>
              <p>{t('terms_acceptance_content')}</p>
            </section>
          </div>
        </div>
      )
    },
    { 
      id: 'contact', 
      title: t('contact_us'), 
      icon: Mail, 
      color: 'text-amber-500',
      content: (
        <div className="space-y-6">
          <p>{t('contact_content_detailed')}</p>
          <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 space-y-2">
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">{t('contact_email_label')}</h5>
            <p className="text-lg font-bold text-white tracking-tight">{t('contact_email_value')}</p>
          </div>
        </div>
      )
    },
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
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_40px_rgba(168,85,247,0.1)]"
          >
            <SankalpIcon className="text-primary" size={40} />
          </motion.div>
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
              <AccordionContent className="pb-6 text-[11px] leading-relaxed text-white/50 font-medium">
                {section.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="pt-8 space-y-4">
          <div className="h-px bg-white/5" />
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
        
        <div className="text-center opacity-20 pointer-events-none pb-4 mt-8">
          <p className="text-[8px] font-black uppercase tracking-[0.4em]">{t('app_name')} PRO v2.5.0</p>
        </div>
      </div>
    </PortalSheet>
  );
}