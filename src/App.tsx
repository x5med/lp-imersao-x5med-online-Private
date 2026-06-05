import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronDown, ChevronUp, X, ArrowRight, Star, ShieldCheck, Clock, Users, TrendingUp, Activity, Award, Timer, CalendarDays, Video, LockKeyhole, MessageCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { captureUtmParams, getUtmParams } from './lib/utm';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Fotos reais dos especialistas
import logoX5 from '../assets/x5 med logo.png';
import heroGroup from '../assets/4 palestrantes juntos.png';
import fotoVital from '../assets/Foto Vital.jpeg';
import fotoFabio from '../assets/Foto Fábio.jpeg';
import fotoPatricia from '../assets/Foto Dra. Patrícia.jpeg';
import fotoPatricio from '../assets/Foto Patrício.jpeg';
import imgIngressos from '../assets/ingressos-x5med.png';

// Depoimentos reais
import dep01 from '../assets/depoimentos/Captura de tela 2026-03-30 072902.png';
import dep02 from '../assets/depoimentos/Captura de tela 2026-03-30 072937.png';
import dep03 from '../assets/depoimentos/Captura de tela 2026-03-30 072950.png';
import dep04 from '../assets/depoimentos/Captura de tela 2026-03-30 073008.png';
import dep05 from '../assets/depoimentos/Captura de tela 2026-03-30 073025.png';
import dep06 from '../assets/depoimentos/Captura de tela 2026-03-30 073100.png';
import dep07 from '../assets/depoimentos/Captura de tela 2026-03-30 073108.png';
import dep08 from '../assets/depoimentos/Captura de tela 2026-03-30 073125.png';
import dep09 from '../assets/depoimentos/Captura de tela 2026-03-30 073140.png';
import dep10 from '../assets/depoimentos/Captura de tela 2026-03-30 073149.png';
import dep11 from '../assets/depoimentos/Captura de tela 2026-03-30 073200.png';
import dep12 from '../assets/depoimentos/Captura de tela 2026-03-30 073212.png';
import dep13 from '../assets/depoimentos/Captura de tela 2026-03-30 073221.png';
import dep14 from '../assets/depoimentos/Captura de tela 2026-03-30 073231.png';
import dep15 from '../assets/depoimentos/Captura de tela 2026-03-30 073237.png';
import dep16 from '../assets/depoimentos/Captura de tela 2026-03-30 073313.png';
import dep17 from '../assets/depoimentos/Captura de tela 2026-03-30 073332.png';
import dep18 from '../assets/depoimentos/Captura de tela 2026-03-30 073412.png';
import dep19 from '../assets/depoimentos/Captura de tela 2026-03-30 073426.png';

const CTA_LINK = "#candidatura";
const primaryCtaText = "QUERO RESERVAR MINHA VAGA";
const whatsappMessage = "Olá, time X5 Med. Quero falar sobre a Imersão X5 Med Online e entender como reservar minha vaga.";
const WHATSAPP_LINK = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

const eventFacts = [
  { icon: <CalendarDays className="w-4 h-4" />, label: "Domingo, 14 de junho" },
  { icon: <Video className="w-4 h-4" />, label: "Online e ao vivo" },
  { icon: <Clock className="w-4 h-4" />, label: "1 dia intensivo" },
];

// Countdown target: 14 de junho de 2026 (domingo), 08:00 BRT
const EVENT_DATE = new Date('2026-06-14T08:00:00-03:00');

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function Button({ children, href, variant = 'primary', className = '' }: { children: React.ReactNode, href: string, variant?: 'primary' | 'secondary' | 'whatsapp', className?: string }) {
  const baseStyle = "btn-base px-8 py-4 text-lg md:text-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange";
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    whatsapp: "btn-whatsapp"
  };

  return (
    <a href={href} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </a>
  );
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={logoX5}
        alt="X5 Med"
        width={compact ? 34 : 46}
        height={compact ? 24 : 32}
        className={compact ? "h-6 w-auto" : "h-7 w-auto md:h-8"}
      />
      <div className={compact ? "font-heading text-sm font-black tracking-widest uppercase" : "font-heading font-black text-lg md:text-xl tracking-widest uppercase"}>
        <span className="text-white">Imersão</span> <span className="text-brand-orange">Online</span>
      </div>
    </div>
  );
}

function EventFact({ icon, label }: { icon: React.ReactNode, label: string, key?: React.Key }) {
  return (
    <div className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-xs font-semibold text-gray-200">
      <span className="text-brand-orange">{icon}</span>
      {label}
    </div>
  );
}

// Texto com efeito shimmer elegante (brilho branco deslizante sobre laranja)
function ShimmerText({ children, className = '', duration = 2.5, delay = 0.3 }: { children: React.ReactNode, className?: string, duration?: number, delay?: number }) {
  return (
    <span className="overflow-hidden inline">
      <motion.span
        className={`inline text-brand-orange ${className}`}
        style={{
          WebkitTextFillColor: 'transparent',
          background: 'currentColor linear-gradient(to right, currentColor 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.6) 60%, currentColor 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '50% 200%',
        } as React.CSSProperties}
        initial={{ backgroundPositionX: '250%' }}
        animate={{ backgroundPositionX: ['-100%', '250%'] }}
        transition={{ duration, delay, repeat: Infinity, repeatDelay: 0.8, ease: 'linear' }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// Componente wrapper para scroll-reveal
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode, className?: string, delay?: number, key?: React.Key }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.25, 1, 0.5, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CountdownUnit({ value, label }: { value: number, label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-md px-2 py-1 min-w-[36px]">
        <span className="text-base md:text-lg font-black font-heading tabular-nums">{String(value).padStart(2, '0')}</span>
      </div>
      <span className="text-[8px] md:text-[10px] uppercase tracking-wider text-white/60 mt-0.5">{label}</span>
    </div>
  );
}

function TopBar() {
  const { days, hours, minutes, seconds } = useCountdown(EVENT_DATE);

  return (
    <div className="bg-brand-orange text-white py-1.5 px-3">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-4 md:gap-5">
        <span className="text-[10px] md:text-xs font-bold tracking-[0.12em] uppercase text-center">
          Domingo, 14 de junho | 100% Online e Ao Vivo
        </span>
        <div className="flex items-center gap-1.5">
          <Timer className="w-3.5 h-3.5" />
          <div className="flex items-center gap-1">
            <CountdownUnit value={days} label="dias" />
            <span className="text-sm font-bold text-white/70">:</span>
            <CountdownUnit value={hours} label="hrs" />
            <span className="text-sm font-bold text-white/70">:</span>
            <CountdownUnit value={minutes} label="min" />
            <span className="text-sm font-bold text-white/70">:</span>
            <CountdownUnit value={seconds} label="seg" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -24, scale: 0.98 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed left-3 right-3 top-3 z-50 md:left-6 md:right-6"
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between rounded-2xl border border-brand-orange/25 bg-black/78 px-3 py-2.5 shadow-[0_18px_54px_rgba(0,0,0,0.55),0_0_34px_rgba(237,140,0,0.14)] backdrop-blur-xl">
            <div className="hidden md:flex min-w-0 items-center gap-3">
              <img src={logoX5} alt="X5 Med" width={34} height={24} className="h-6 w-auto" />
              <span className="font-heading font-bold text-sm tracking-wider uppercase">Imersão Online</span>
              <span className="text-gray-500 text-sm">|</span>
              <span className="text-gray-400 text-sm">Imersão Online — domingo, 14 de junho</span>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
              <a href={CTA_LINK} className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-green px-6 py-2.5 text-center text-sm font-bold text-white shadow-[0_0_22px_rgba(0,178,16,0.42)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_36px_rgba(0,178,16,0.62)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange">
                {primaryCtaText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Hero() {
  return (
    <section className="relative flex justify-center bg-[#111111] px-4 pb-5 pt-4 md:pt-6">
      <div className="relative mx-auto grid w-full max-w-[1180px] items-center overflow-hidden rounded-[1.35rem] border border-brand-orange/20 bg-[radial-gradient(circle_at_78%_36%,rgba(237,140,0,0.18),transparent_34%),linear-gradient(135deg,#050505_0%,#101010_50%,#070707_100%)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:rounded-[1.75rem] md:p-8 lg:min-h-[615px] lg:grid-cols-[minmax(0,0.96fr)_minmax(420px,0.86fr)] lg:gap-10 lg:px-10 lg:py-9">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange/70 to-transparent"></div>
        <div className="absolute -right-20 top-8 h-[420px] w-[420px] rounded-full bg-brand-orange/12 blur-[90px]"></div>
        <div className="absolute bottom-0 left-0 h-40 w-full bg-[linear-gradient(0deg,rgba(237,140,0,0.08),transparent)]"></div>

        <div className="relative z-10 flex w-full max-w-[640px] flex-col items-start text-left lg:py-2">
          <div className="mb-5 flex w-full flex-wrap items-center justify-between gap-4 md:mb-6">
            <BrandMark compact />
            <span className="rounded-lg border border-brand-orange/25 bg-brand-orange/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-orange">
              Vagas por aplicação
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 flex flex-wrap gap-2 md:mb-6"
          >
            {eventFacts.map((fact) => (
              <EventFact key={fact.label} icon={fact.icon} label={fact.label} />
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 max-w-[620px] font-heading text-[2.1rem] font-extrabold leading-[1.04] tracking-tight md:text-[2.85rem] lg:text-[3.15rem]"
          >
            Sua clínica pode crescer mais{' '}
            <ShimmerText>sem consumir ainda mais da sua vida e do seu tempo.</ShimmerText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-6 max-w-[560px] text-base leading-relaxed text-gray-300 md:text-lg"
          >
            Para médicos que querem parar de operar apenas como excelentes profissionais e começar a crescer como empresários de fato.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="order-5 mb-7 grid max-w-[610px] gap-3 border-l border-brand-orange/30 pl-4 text-sm leading-relaxed text-gray-300 sm:order-none md:text-[0.98rem]"
          >
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-green shrink-0" /> Atrair pacientes com autoridade e menos dependência de convênio</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-green shrink-0" /> Converter melhor, precificar melhor e aumentar margem</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-green shrink-0" /> Organizar gestão, time e operação para crescer sem caos</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="order-4 mb-3 flex w-full flex-col items-stretch gap-3 sm:order-none sm:flex-row sm:items-center lg:max-w-[610px]"
          >
            <Button href={CTA_LINK} className="w-full px-7 py-3.5 text-base md:px-8 md:py-4 md:text-lg sm:flex-[1.08]">
              {primaryCtaText}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button href={WHATSAPP_LINK} variant="whatsapp" className="w-full px-6 py-3.5 text-base md:text-lg sm:flex-[0.82]">
              <MessageCircle className="w-5 h-5 mr-2" />
              FALAR COM O TIME
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="order-6 text-xs text-gray-500 sm:order-none"
          >
            Aplicação rápida. O time da X5 Med confirma sua vaga pelo WhatsApp.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative z-10 mt-6 flex w-full justify-center lg:hidden"
        >
          <div className="relative w-full max-w-[380px] overflow-hidden rounded-2xl border border-brand-orange/18 bg-[radial-gradient(circle_at_50%_32%,rgba(237,140,0,0.22),transparent_48%),linear-gradient(180deg,rgba(237,140,0,0.08),rgba(255,255,255,0.02))] pt-4">
            <img
              src={heroGroup}
              alt="Dr. Vital Araújo, Dr. Fábio Rodrigues, Dra. Patrícia Santiago e Patrício Darvisson — Especialistas X5 Med"
              className="mx-auto max-h-[300px] w-full scale-[1.04] object-contain object-bottom"
              style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 86%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 0%, black 86%, transparent 100%)' }}
              width={994}
              height={994}
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </motion.div>

        <div className="relative z-10 hidden min-h-[500px] w-full items-end justify-center self-stretch lg:flex">
          <div className="absolute inset-x-0 bottom-0 h-[74%] overflow-hidden rounded-[1.35rem] border border-brand-orange/18 bg-[radial-gradient(circle_at_50%_18%,rgba(237,140,0,0.24),transparent_42%),linear-gradient(180deg,rgba(237,140,0,0.08),rgba(255,255,255,0.02)_48%,rgba(0,0,0,0.5))] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"></div>
          <div className="absolute inset-x-8 bottom-0 h-28 bg-[radial-gradient(ellipse_at_center,rgba(237,140,0,0.2),transparent_66%)] blur-xl"></div>
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="pointer-events-none absolute left-1/2 top-[39%] z-0 -translate-x-1/2 -translate-y-1/2 select-none font-heading text-[11rem] font-black text-brand-orange/[0.04]"
          >
            X5
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative z-10 w-full"
          >
            <img
              src={heroGroup}
              alt="Dr. Vital Araújo, Dr. Fábio Rodrigues, Dra. Patrícia Santiago e Patrício Darvisson — Especialistas X5 Med"
              className="mx-auto max-h-[570px] w-[112%] max-w-none -translate-x-[2%] -translate-y-6 object-contain object-bottom drop-shadow-[0_28px_55px_rgba(0,0,0,0.45)]"
              style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 88%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 0%, black 88%, transparent 100%)' }}
              width={994}
              height={994}
              decoding="async"
              fetchPriority="high"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}

function HeroReorganized() {
  return (
    <section className="relative isolate flex justify-center bg-[#111111] px-4 pb-6 pt-4 md:pt-6">
      <div className="relative mx-auto grid w-full max-w-[1200px] overflow-hidden rounded-[1.35rem] border border-brand-orange/20 bg-[radial-gradient(circle_at_72%_36%,rgba(237,140,0,0.18),transparent_34%),linear-gradient(135deg,#050505_0%,#101010_52%,#070707_100%)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:rounded-[1.75rem] md:p-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(430px,1.08fr)] lg:gap-x-10 lg:gap-y-7 lg:px-10 lg:py-9">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange/70 to-transparent"></div>
        <div className="absolute -right-24 top-4 h-[460px] w-[460px] rounded-full bg-brand-orange/12 blur-[95px]"></div>
        <div className="absolute bottom-0 left-0 h-40 w-full bg-[linear-gradient(0deg,rgba(237,140,0,0.08),transparent)]"></div>

        <div className="relative z-10 col-span-full mb-7 flex flex-col gap-4 lg:mb-0 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <BrandMark compact />
            <span className="rounded-lg border border-brand-orange/25 bg-brand-orange/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-orange">
              Vagas por aplicação
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-2"
          >
            {eventFacts.map((fact) => (
              <EventFact key={fact.label} icon={fact.icon} label={fact.label} />
            ))}
          </motion.div>
        </div>

        <div className="relative z-10 flex w-full max-w-[640px] flex-col items-start text-left lg:self-center lg:pb-3">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 max-w-[620px] font-heading text-[2.1rem] font-extrabold leading-[1.04] tracking-tight md:text-[2.85rem] lg:text-[3.2rem]"
          >
            Sua clínica pode crescer mais{' '}
            <ShimmerText>sem consumir ainda mais da sua vida e do seu tempo.</ShimmerText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-6 max-w-[560px] text-base leading-relaxed text-gray-300 md:text-lg"
          >
            Para médicos que querem parar de operar apenas como excelentes profissionais e começar a crescer como empresários de fato.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mb-3 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:max-w-[610px]"
          >
            <Button href={CTA_LINK} className="w-full px-7 py-3.5 text-base md:px-8 md:py-4 md:text-lg sm:flex-[1.08]">
              {primaryCtaText}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button href={WHATSAPP_LINK} variant="whatsapp" className="w-full px-6 py-3.5 text-base md:text-lg sm:flex-[0.82]">
              <MessageCircle className="w-5 h-5 mr-2" />
              FALAR COM O TIME
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mb-6 text-xs text-gray-500"
          >
            Aplicação rápida. O time da X5 Med confirma sua vaga pelo WhatsApp.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="grid max-w-[610px] gap-2.5 text-sm leading-relaxed text-gray-300 md:text-[0.98rem]"
          >
            <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" /> Atrair pacientes com autoridade e menos dependência de convênio</div>
            <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" /> Converter melhor, precificar melhor e aumentar margem</div>
            <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" /> Organizar gestão, time e operação para crescer sem caos</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.25 }}
          className="relative z-10 mt-7 min-h-[320px] w-full overflow-hidden rounded-[1.25rem] border border-brand-orange/18 bg-[radial-gradient(circle_at_50%_26%,rgba(237,140,0,0.24),transparent_44%),linear-gradient(180deg,rgba(237,140,0,0.08),rgba(255,255,255,0.02)_45%,rgba(0,0,0,0.5))] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:mt-0 lg:min-h-[560px] lg:self-stretch"
        >
          <div className="absolute inset-x-8 bottom-0 h-28 bg-[radial-gradient(ellipse_at_center,rgba(237,140,0,0.22),transparent_66%)] blur-xl"></div>
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="pointer-events-none absolute left-1/2 top-[32%] z-0 -translate-x-1/2 -translate-y-1/2 select-none font-heading text-[8rem] font-black text-brand-orange/[0.04] md:text-[11rem] lg:text-[14rem]"
          >
            X5
          </motion.div>
          <img
            src={heroGroup}
            alt="Dr. Vital Araújo, Dr. Fábio Rodrigues, Dra. Patrícia Santiago e Patrício Darvisson — Especialistas X5 Med"
            className="absolute inset-x-1/2 bottom-0 z-10 h-auto max-h-[330px] w-[112%] max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-[0_28px_55px_rgba(0,0,0,0.45)] sm:max-h-[390px] md:w-[92%] lg:max-h-[600px] lg:w-[102%]"
            style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 88%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 0%, black 88%, transparent 100%)' }}
            width={994}
            height={994}
            decoding="async"
            fetchPriority="high"
          />
        </motion.div>
      </div>
    </section>
  );
}

function HeroEventStage() {
  return (
    <section className="relative isolate flex justify-center bg-[#111111] px-4 pb-6 pt-4 md:pt-6">
      <div className="relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-[1.4rem] border border-brand-orange/25 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.55)] md:rounded-[1.85rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(237,140,0,0.24),transparent_34%),linear-gradient(180deg,#070707_0%,#111_46%,#050505_100%)]"></div>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange/80 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(0deg,#050505_8%,rgba(5,5,5,0.82)_42%,transparent)]"></div>

        <div className="relative z-20 mx-4 mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/45 p-3 backdrop-blur-md sm:mx-6 sm:flex-row sm:items-center sm:justify-between md:mx-8 md:mt-7 md:px-5">
          <BrandMark compact />
          <div className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-300 lg:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange"></span>
            Garanta sua vaga antes das confirmações encerrarem
          </div>
          <a href={CTA_LINK} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-brand-orange/30 bg-brand-orange/12 px-5 text-xs font-bold uppercase tracking-[0.12em] text-brand-orange transition-all hover:bg-brand-orange hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange">
            Reservar vaga
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>

        <div className="relative z-10 min-h-[990px] px-5 pb-0 pt-10 text-center sm:px-8 md:min-h-[1030px] md:pt-12 lg:px-12">
          <div className="pointer-events-none absolute inset-x-0 top-[650px] z-0 mx-auto h-[430px] max-w-[980px] opacity-95 md:top-[610px] md:h-[520px]">
            <div className="absolute inset-x-10 top-0 h-44 rounded-full bg-brand-orange/20 blur-[70px]"></div>
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute left-1/2 top-[22%] -translate-x-1/2 select-none font-heading text-[8rem] font-black text-brand-orange/[0.045] md:text-[14rem]"
            >
              X5
            </motion.div>
            <img
              src={heroGroup}
              alt="Dr. Vital Araújo, Dr. Fábio Rodrigues, Dra. Patrícia Santiago e Patrício Darvisson — Especialistas X5 Med"
              className="absolute inset-x-1/2 bottom-0 h-auto max-h-[380px] w-[118%] max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-[0_34px_70px_rgba(0,0,0,0.6)] sm:w-[96%] md:max-h-[500px] lg:w-[82%]"
              style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 84%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 0%, black 84%, transparent 100%)' }}
              width={994}
              height={994}
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-[190px] z-[15] mx-auto h-[360px] max-w-[920px] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.44)_48%,rgba(0,0,0,0.08)_76%,transparent_100%)] md:top-[185px] md:h-[380px]"></div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative z-20 mx-auto mb-5 inline-flex items-center rounded-full border border-brand-orange/25 bg-black/55 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-orange shadow-[0_12px_30px_rgba(0,0,0,0.28)] backdrop-blur-md"
          >
            A diferença não é esforço. É estrutura.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="relative z-20 mx-auto max-w-[850px] font-heading text-[2.1rem] font-black uppercase leading-[1.02] tracking-tight text-white md:text-[3.55rem] lg:text-[4.1rem]"
          >
            Sua clínica pode crescer mais <ShimmerText>sem consumir sua vida.</ShimmerText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="relative z-20 mx-auto mt-5 max-w-[660px] text-base leading-relaxed text-gray-200 md:text-lg"
          >
            Um dia intensivo para médicos que querem deixar de operar apenas como excelentes profissionais e começar a crescer como empresários de fato.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="relative z-20 mx-auto mt-7 flex max-w-[650px] flex-col items-stretch gap-3 sm:flex-row"
          >
            <Button href={CTA_LINK} className="w-full px-7 py-3.5 text-base md:px-8 md:py-4 md:text-lg sm:flex-[1.08]">
              {primaryCtaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button href={WHATSAPP_LINK} variant="whatsapp" className="w-full px-6 py-3.5 text-base md:text-lg sm:flex-[0.82]">
              <MessageCircle className="mr-2 h-5 w-5" />
              FALAR COM O TIME
            </Button>
          </motion.div>

          <div className="relative z-20 mx-auto mt-4 flex flex-wrap items-center justify-center gap-2 text-left">
            {eventFacts.map((fact) => (
              <EventFact key={fact.label} icon={fact.icon} label={fact.label} />
            ))}
          </div>

          <p className="relative z-20 mt-3 text-xs text-gray-500">
            Aplicação rápida. O time da X5 Med confirma sua vaga pelo WhatsApp.
          </p>
        </div>

        <div className="relative z-20 border-t border-brand-orange/20 bg-black/65 px-4 py-4">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 text-sm text-gray-300 md:flex-row md:items-center md:justify-center">
            <div className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" /> Atrair pacientes com autoridade</div>
            <div className="hidden h-4 w-px bg-white/15 md:block"></div>
            <div className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" /> Converter e precificar melhor</div>
            <div className="hidden h-4 w-px bg-white/15 md:block"></div>
            <div className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" /> Crescer com gestão e operação</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroWideImage() {
  return (
    <section className="relative isolate overflow-hidden bg-[#111111] px-4 pb-10 pt-5 md:pb-14 md:pt-7">
      <div className="absolute inset-x-0 top-0 h-[68%] bg-[linear-gradient(180deg,#000000_0%,#050505_70%,#000000_100%)]"></div>
      <div className="absolute left-1/2 top-24 h-[360px] w-[620px] -translate-x-1/2 rounded-full bg-brand-orange/[0.055] blur-[105px]"></div>
      <div className="relative z-10 mx-auto max-w-[1280px]">
        <div className="mb-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <BrandMark compact />
          <div className="flex flex-wrap justify-center gap-2">
            {eventFacts.map((fact) => (
              <EventFact key={fact.label} icon={fact.icon} label={fact.label} />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto min-h-[360px] max-w-[1120px] md:min-h-[540px] lg:min-h-[600px]"
        >
          <div className="absolute inset-x-8 bottom-8 h-44 bg-[radial-gradient(ellipse_at_center,rgba(237,140,0,0.24),transparent_68%)] blur-2xl"></div>
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="pointer-events-none absolute left-1/2 top-[25%] -translate-x-1/2 select-none font-heading text-[8rem] font-black text-brand-orange/[0.04] md:text-[15rem]"
          >
            X5
          </motion.div>
          <img
            src={heroGroup}
            alt="Dr. Vital Araújo, Dr. Fábio Rodrigues, Dra. Patrícia Santiago e Patrício Darvisson — Especialistas X5 Med"
            className="absolute inset-x-1/2 bottom-0 h-auto max-h-[390px] w-[122%] max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-[0_38px_80px_rgba(0,0,0,0.58)] sm:w-[100%] md:max-h-[580px] lg:max-h-[650px] lg:w-[92%]"
            style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, black 66%, transparent 86%)', maskImage: 'radial-gradient(ellipse at center, black 0%, black 66%, transparent 86%)' }}
            width={994}
            height={994}
            decoding="async"
            fetchPriority="high"
          />
        </motion.div>

        <div className="relative z-10 mx-auto -mt-3 max-w-[820px] text-center md:-mt-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mb-3 inline-flex items-center rounded-full border border-brand-orange/25 bg-black/35 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-orange"
          >
            A diferença não é esforço. É estrutura.
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mx-auto max-w-[680px] font-heading text-[1.55rem] font-black uppercase leading-[1.08] tracking-tight text-white md:text-[2.05rem] lg:text-[2.35rem]"
          >
            Sua clínica pode crescer mais <ShimmerText>sem consumir sua vida.</ShimmerText>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mx-auto mt-3 max-w-[560px] text-sm leading-relaxed text-gray-400 md:text-[0.95rem]"
          >
            Um dia intensivo para médicos que querem deixar de operar apenas como excelentes profissionais e começar a crescer como empresários de fato.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mx-auto mt-5 flex max-w-[580px] flex-col items-stretch gap-3 sm:flex-row"
          >
            <Button href={CTA_LINK} className="w-full px-7 py-3.5 text-base md:px-8 md:py-4 md:text-lg sm:flex-[1.08]">
              {primaryCtaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button href={WHATSAPP_LINK} variant="whatsapp" className="w-full px-6 py-3.5 text-base md:text-lg sm:flex-[0.82]">
              <MessageCircle className="mr-2 h-5 w-5" />
              FALAR COM O TIME
            </Button>
          </motion.div>
          <p className="mt-3 text-xs text-gray-500">
            Aplicação rápida. O time da X5 Med confirma sua vaga pelo WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}

function Identification() {
  return (
    <section className="py-16 md:py-20 px-4 bg-brand-dark">
      <div className="max-w-4xl mx-auto text-center">
        <Reveal>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-8 leading-tight">
            Você investiu anos para aprender medicina.<br/>
            <ShimmerText>Mas ninguém te ensinou a construir uma clínica que cresce.</ShimmerText>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="text-gray-300 text-lg md:text-xl space-y-6 leading-relaxed text-left md:text-center mx-auto max-w-3xl">
            <p>A maioria dos médicos foi treinada para atender bem.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto bg-white/[0.03] backdrop-blur-sm p-8 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3"><X className="text-red-500 w-6 h-6 shrink-0"/> Não para posicionar.</div>
              <div className="flex items-center gap-3"><X className="text-red-500 w-6 h-6 shrink-0"/> Não para vender valor.</div>
              <div className="flex items-center gap-3"><X className="text-red-500 w-6 h-6 shrink-0"/> Não para gerir equipe.</div>
              <div className="flex items-center gap-3"><X className="text-red-500 w-6 h-6 shrink-0"/> Não para organizar financeiro.</div>
              <div className="flex items-center gap-3 md:col-span-2"><X className="text-red-500 w-6 h-6 shrink-0"/> Não para escalar uma operação com lucro.</div>
            </div>

            <p className="pt-6 font-semibold text-white text-2xl">Por isso tantos médicos vivem a mesma armadilha:</p>
            <p className="text-gray-400 italic text-xl">Atendem muito. Trabalham demais. Resolvem tudo. Faturam razoavelmente.</p>
            <p className="text-2xl font-bold text-white">Mas seguem presos em uma clínica que depende deles para funcionar.</p>

            <div className="mt-12 p-6 border-l-4 border-brand-orange bg-brand-orange/5 text-left">
              <p className="text-xl">O problema não é falta de competência médica.</p>
              <p className="text-2xl font-bold text-brand-orange mt-2">O problema é ausência de estrutura empresarial.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Pain() {
  return (
    <section className="py-16 md:py-20 px-4 bg-brand-darker relative overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <Reveal className="md:w-1/2">
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6 leading-tight">
            Agenda cheia não é o mesmo que <span className="text-gradient-orange">clínica saudável.</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Você pode estar vendo pacientes todos os dias e, ainda assim, estar perdendo dinheiro sem perceber.
          </p>
          <ul className="space-y-4 mb-8">
            {[
              "Perdendo margem na precificação.",
              "Perdendo autoridade no posicionamento.",
              "Perdendo oportunidades na conversão.",
              "Perdendo escala por falta de gestão.",
              "Perdendo liberdade porque tudo depende de você."
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-400">
                <div className="w-2 h-2 rounded-full bg-brand-orange shrink-0"></div>
                {item}
              </li>
            ))}
          </ul>
          <div className="bg-white/[0.03] backdrop-blur-sm p-6 rounded-xl border border-white/10">
            <p className="text-xl font-medium text-white mb-2">Quando a clínica cresce sem estrutura, o crescimento vira peso.</p>
            <p className="text-brand-orange font-bold text-xl">Você não constrói um negócio. Você constrói uma dependência.</p>
          </div>
        </Reveal>
        <Reveal className="md:w-1/2 relative flex items-center justify-center" delay={0.2}>
          <img
            src={imgIngressos}
            alt="Ingressos Imersão X5 Med Online — domingo, 14 de junho"
            className="w-full max-w-[240px] md:max-w-md mx-auto drop-shadow-[0_25px_50px_rgba(237,140,0,0.25)] hover:scale-[1.02] transition-transform duration-500"
            width={768}
            height={1376}
            loading="lazy"
            decoding="async"
          />
        </Reveal>
      </div>
    </section>
  );
}

function Solution() {
  return (
    <section className="py-20 md:py-24 px-4 bg-brand-orange text-brand-darker text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[linear-gradient(45deg,rgba(0,0,0,0.3)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.3)_50%,rgba(0,0,0,0.3)_75%,transparent_75%,transparent)] bg-[length:18px_18px]"></div>
      <Reveal className="max-w-4xl mx-auto relative z-10">
        <h2 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl tracking-tight mb-8 uppercase">
          A Imersão X5 Med Online <br/>existe para corrigir isso.
        </h2>
        <p className="text-xl md:text-3xl font-medium mb-8 leading-snug">
          Em 1 dia intensivo, você vai acessar o método da X5 Med para ajudar médicos a fazer a transição mais importante da carreira:
        </p>
        <p className="text-2xl md:text-4xl font-black bg-brand-darker text-white inline-block px-6 py-4 rounded-xl shadow-xl transform -rotate-2 mb-12">
          de profissional assistencial para empresário da própria clínica.
        </p>
        <div className="text-lg md:text-2xl font-bold opacity-80 uppercase tracking-widest">
          <p>Não é sobre teoria bonita.</p>
          <p className="mt-2">É sobre aprender o que realmente move crescimento com lucro, previsibilidade e controle.</p>
        </div>
      </Reveal>
    </section>
  );
}

function Pillars() {
  const pillars = [
    {
      num: "01",
      title: "Mentalidade",
      subtitle: "Mentalidade empresarial",
      desc: "Pare de decidir como executor e comece a pensar como dono. Aprenda a desenvolver a visão, a postura e a clareza necessárias para crescer sem continuar refém da própria agenda.",
      icon: <Activity className="w-8 h-8 text-brand-orange" />
    },
    {
      num: "02",
      title: "Atração",
      subtitle: "Atração de pacientes",
      desc: "Marketing, branding, posicionamento e autoridade para atrair os pacientes certos. Entenda como construir presença, desejo e diferenciação em um mercado cada vez mais competitivo.",
      icon: <Users className="w-8 h-8 text-brand-orange" />
    },
    {
      num: "03",
      title: "Conversão",
      subtitle: "Conversão em receita",
      desc: "Não basta atrair. Você precisa transformar demanda em faturamento, margem e experiência. Aqui entra comercial, jornada do paciente, sucesso do cliente, precificação e aumento de ticket.",
      icon: <TrendingUp className="w-8 h-8 text-brand-orange" />
    },
    {
      num: "04",
      title: "Expansão",
      subtitle: "Expansão com estrutura",
      desc: "Gestão, financeiro, administrativo, jurídico, operacional e qualidade. Porque crescer sem estrutura só aumenta o caos.",
      icon: <ShieldCheck className="w-8 h-8 text-brand-orange" />
    },
    {
      num: "05",
      title: "Técnico",
      subtitle: "Evolução técnica com visão de negócio",
      desc: "Áreas em ascensão na medicina, como emagrecimento, reposição hormonal, implantes subcutâneos, injetáveis, testes genéticos e metabólicos. Você vai entender como novas frentes técnicas podem ampliar diferenciação, valor percebido e rentabilidade.",
      icon: <Award className="w-8 h-8 text-brand-orange" />
    }
  ];

  return (
    <section className="py-16 md:py-20 px-4 bg-brand-dark relative">
      <div className="ambient-orb w-[520px] h-[520px] bg-brand-orange/6 top-0 left-[-180px]"></div>
      <div className="ambient-orb w-[420px] h-[420px] bg-brand-orange/4 bottom-0 right-[-120px]"></div>

      <div className="max-w-6xl mx-auto">
        <Reveal>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight text-center mb-16 leading-tight">
            Os 5 pilares que sustentam uma clínica <br className="hidden md:block"/>
            <ShimmerText>forte, lucrativa e preparada para crescer</ShimmerText>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {pillars.map((pillar, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className={`glass-card p-8 rounded-2xl group relative overflow-hidden flex flex-col h-full transition-all duration-500 hover:-translate-y-2 ${i === 3 ? 'lg:col-start-2 lg:col-span-1' : ''} ${i === 4 ? 'lg:col-start-3 lg:col-span-1' : ''}`}>
                <div className="absolute -right-4 -top-4 text-9xl font-heading font-black text-white/5 group-hover:text-brand-orange/10 transition-colors pointer-events-none">
                  {pillar.num}
                </div>
                <div className="mb-6 bg-white/5 w-16 h-16 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:border-brand-orange/30 transition-all duration-500 shrink-0">
                  {pillar.icon}
                </div>
                <h3 className="text-2xl font-bold font-heading mb-2">{pillar.title}</h3>
                <h4 className="text-brand-orange font-semibold mb-4 text-sm uppercase tracking-wider">{pillar.subtitle}</h4>
                <p className="text-gray-400 leading-relaxed relative z-10 flex-grow">{pillar.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatYouWillLearn() {
  const items = [
    {
      title: "Como fortalecer sua mentalidade de empresário",
      desc: "Para parar de operar no automático e assumir o papel de quem constrói crescimento."
    },
    {
      title: "Como atrair mais pacientes com posicionamento e autoridade",
      desc: "Sem depender apenas de indicação ou convênios."
    },
    {
      title: "Como converter mais e precificar melhor",
      desc: "Para transformar atendimento em receita saudável e previsível."
    },
    {
      title: "Como organizar gestão, equipe e operação",
      desc: "Para sua clínica crescer com mais controle e menos improviso."
    },
    {
      title: "Como enxergar novas oportunidades de expansão técnica",
      desc: "Em áreas que estão ganhando força no mercado médico."
    }
  ];

  return (
    <section className="py-16 md:py-20 px-4 bg-brand-darker relative overflow-hidden">
      <div className="fading-line absolute top-0 left-0"></div>
      <div className="fading-line absolute bottom-0 left-0"></div>
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight text-center mb-16">
            O que você vai aprender <span className="text-gradient-orange">na prática</span> <br/>durante a imersão
          </h2>
        </Reveal>

        <div className="space-y-6">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white/[0.03] backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/10 hover:border-brand-orange/30 hover:bg-white/[0.06] transition-all duration-500">
                <div className="bg-brand-orange/20 p-4 rounded-full shrink-0">
                  <Check className="w-8 h-8 text-brand-orange" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-lg">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="mt-10 text-center">
            <Button href={CTA_LINK}>RESERVAR MINHA VAGA</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TargetAudience() {
  return (
      <section className="section-deferred py-16 md:py-20 px-4 bg-black">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <Reveal>
          <div className="bg-white/[0.03] backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-green-500/20 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full blur-2xl"></div>
            <h3 className="font-heading font-bold text-3xl mb-8 text-white">Essa imersão é para você que...</h3>
            <ul className="space-y-6">
              {[
                "É médico e quer transformar sua clínica em um negócio mais lucrativo e previsível.",
                "Quer atrair mais pacientes com posicionamento forte.",
                "Quer melhorar conversão, jornada, preço e margem.",
                "Quer crescer com gestão, processo e estrutura.",
                "Quer entender como unir visão empresarial com novas oportunidades técnicas da medicina."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                  <span className="text-gray-300 text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="bg-white/[0.03] backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-red-500/20 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full blur-2xl"></div>
            <h3 className="font-heading font-bold text-3xl mb-8 text-gray-400">Essa imersão não é para você que...</h3>
            <ul className="space-y-6 opacity-70">
              {[
                "Acredita que crescer depende apenas de trabalhar mais.",
                "Quer só conteúdo técnico sem visão de negócio.",
                "Procura fórmula mágica, sem execução.",
                "Não está disposto a encarar a clínica como empresa."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <X className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                  <span className="text-gray-300 text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function BeliefBreaking() {
  return (
    <section className="py-20 md:py-24 px-4 bg-brand-darker text-center relative">
      <Reveal className="max-w-4xl mx-auto">
        <h2 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl tracking-tight mb-8 leading-tight">
          Você não precisa atender mais para crescer.<br/>
          <span className="text-gradient-orange">Precisa construir melhor.</span>
        </h2>
        <div className="text-xl md:text-2xl text-gray-300 space-y-6 leading-relaxed">
          <p>Mais esforço não corrige um modelo desorganizado.</p>
          <p>Se sua clínica depende de você para vender, resolver, organizar, liderar e apagar incêndio, você não tem uma empresa sólida.</p>
          <p className="text-white font-bold text-2xl md:text-3xl py-6">Você tem uma operação apoiada no seu cansaço.</p>
          <p className="text-brand-orange font-semibold uppercase tracking-widest">A imersão vai mostrar como sair dessa lógica.</p>
        </div>
      </Reveal>
    </section>
  );
}

function DecisionBridge() {
  const assurances = [
    "Online e ao vivo, sem deslocamento.",
    "Contato por WhatsApp em até 24h.",
    "Conteúdo para clínica, consultório e expansão.",
  ];

  return (
    <section className="px-4 py-12 md:py-14 bg-brand-darker">
      <Reveal className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center rounded-[1.25rem] border border-brand-orange/25 bg-[linear-gradient(135deg,rgba(237,140,0,0.14),rgba(255,255,255,0.035)_44%,rgba(0,178,16,0.08))] p-6 md:p-9">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-orange">
              <LockKeyhole className="w-4 h-4" />
              Próximo passo
            </span>
            <h2 className="mt-5 font-heading text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Se você quer crescer com mais estrutura, faça a reserva agora e siga para a decisão com clareza.
            </h2>
            <p className="mt-4 max-w-2xl text-gray-300 text-lg leading-relaxed">
              O formulário é curto e serve para o time confirmar seu perfil, explicar a taxa simbólica da edição online e orientar o acesso.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/35 p-5 md:p-6">
            <ul className="space-y-3 mb-6">
              {assurances.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button href={CTA_LINK} className="w-full text-base md:text-lg">
              {primaryCtaText}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Authority() {
  const experts = [
    {
      name: "Dr. Vital Araújo",
      role: "Visão estratégica, crescimento e transição do médico para empresário.",
      img: fotoVital,
      objectPos: "center 25%"
    },
    {
      name: "Dr. Fábio Rodrigues",
      role: "Gestão, estrutura e tomada de decisão para clínicas mais fortes.",
      img: fotoFabio
    },
    {
      name: "Dra. Patrícia Santiago",
      role: "Aplicação prática, posicionamento e crescimento com clareza.",
      img: fotoPatricia
    },
    {
      name: "Patrício Darvisson",
      role: "Expansão, gestão e visão empresarial aplicada ao mercado real.",
      img: fotoPatricio
    }
  ];

  return (
    <section className="py-16 md:py-20 px-4 bg-brand-dark">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
              Aprenda com especialistas que vivem a medicina e a gestão <span className="text-gradient-orange">no mundo real</span>
            </h2>
            <p className="text-gray-400 text-lg mb-6">
              Você terá acesso direto a especialistas da X5 Med e a uma visão prática sobre crescimento empresarial na medicina.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-bold uppercase tracking-wider text-brand-orange">
              <span className="bg-brand-orange/10 px-4 py-2 rounded-full">Sem conteúdo genérico</span>
              <span className="bg-brand-orange/10 px-4 py-2 rounded-full">Sem teoria distante</span>
              <span className="bg-brand-orange/10 px-4 py-2 rounded-full">Sem palco bonito e aplicação nula</span>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experts.map((expert, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="group relative overflow-hidden rounded-2xl aspect-[2/3]">
                <img
                  src={expert.img}
                  alt={expert.name}
                  className="absolute inset-0 w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  style={expert.objectPos ? { objectPosition: expert.objectPos } : undefined}
                  width={768}
                  height={1376}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-darker via-brand-darker/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold font-heading text-white mb-2">{expert.name}</h3>
                  <p className="text-brand-orange text-sm font-medium leading-relaxed">{expert.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const testimonials = [dep05, dep06, dep02, dep16, dep17, dep01, dep03, dep07, dep08, dep14, dep15, dep09, dep10, dep11, dep12, dep13, dep04, dep18, dep19];

  const trackRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(0.5); // px per frame — base auto-scroll speed
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);

  // Continuous auto-scroll loop
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const tick = () => {
      const el = trackRef.current;
      if (el && !pausedRef.current) {
        el.scrollLeft += speedRef.current;
        // Loop: when reaching the end, jump back to start
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleHoverStart = (direction: 'prev' | 'next') => {
    speedRef.current = direction === 'next' ? 3 : -3;
  };
  const handleHoverEnd = () => { speedRef.current = 0.5; };
  const handleClick = (direction: 'prev' | 'next') => {
    const el = trackRef.current;
    if (!el) return;
    // Pause auto-scroll briefly for smooth jump
    pausedRef.current = true;
    el.scrollBy({ left: direction === 'prev' ? -350 : 350, behavior: 'smooth' });
    setTimeout(() => { pausedRef.current = false; }, 600);
  };

  // Pause auto-scroll while user drags/touches the track
  const handleTrackPointerDown = () => { pausedRef.current = true; };
  const handleTrackPointerUp = () => { setTimeout(() => { pausedRef.current = false; }, 1500); };

  return (
    <section className="section-deferred py-16 md:py-20 bg-brand-darker relative overflow-hidden">
      <div className="fading-line absolute top-0 left-0"></div>
      <div className="fading-line absolute bottom-0 left-0"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <Reveal>
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4">
              De médicos da vida real, <br/>
              <span className="text-gradient-orange">para médicos da vida real</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl">
              Veja relatos de médicos que participaram e entenderam o que precisava mudar.
            </p>
          </Reveal>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onMouseEnter={() => handleHoverStart('prev')}
              onMouseLeave={handleHoverEnd}
              onClick={() => handleClick('prev')}
              aria-label="Ver depoimentos anteriores"
              className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
            >
              <ChevronUp className="w-5 h-5 -rotate-90" />
            </button>
            <button
              type="button"
              onMouseEnter={() => handleHoverStart('next')}
              onMouseLeave={handleHoverEnd}
              onClick={() => handleClick('next')}
              aria-label="Ver próximos depoimentos"
              className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
            >
              <ChevronDown className="w-5 h-5 -rotate-90" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        id="testimonials-track"
        className="flex items-start gap-5 overflow-x-auto px-4 md:px-[calc((100vw-80rem)/2+1.5rem)] pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        onPointerDown={handleTrackPointerDown}
        onPointerUp={handleTrackPointerUp}
      >
        {testimonials.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.06, 0.3), duration: 0.4 }}
            className="flex-shrink-0 w-[260px] md:w-[300px] snap-start"
          >
            <div className="rounded-2xl overflow-hidden border border-white/10 hover:border-brand-orange/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(237,140,0,0.1)]">
              <img
                src={src}
                alt={`Depoimento de médico participante da X5 Med — resultado ${i + 1}`}
                className="w-full h-auto object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Candidatura() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    instagram: '',
    faturamento: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => { captureUtmParams(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const cleanNome = form.nome.trim();
    const cleanEmail = form.email.trim().toLowerCase();
    const cleanWhatsapp = form.whatsapp.replace(/\D/g, '');
    const cleanInstagram = form.instagram.trim().replace(/^@/, '') || null;

    if (cleanWhatsapp.length < 10) {
      setErrorMsg('Informe um WhatsApp válido com DDD para o time confirmar sua vaga.');
      setStatus('error');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg('Formulário indisponível no momento. Tente novamente em instantes.');
      setStatus('error');
      return;
    }

    try {
      const utm = getUtmParams();
      const { error } = await supabase.from('imersao_x5med_leads').insert({
        nome: cleanNome,
        email: cleanEmail,
        whatsapp: cleanWhatsapp,
        instagram: cleanInstagram,
        faixa_faturamento: form.faturamento,
        ...utm,
      });
      if (error) throw error;
      setStatus('success');
      window.fbq?.('track', 'CompleteRegistration', {
        content_name: 'Imersão X5 Med Online',
        status: true,
        value: 297,
        currency: 'BRL',
      });
    } catch (err) {
      console.error('Erro ao salvar lead:', err);
      setErrorMsg('Ocorreu um erro ao enviar sua reserva. Tente novamente.');
      setStatus('error');
    }
  };

  const fieldClassName = "w-full bg-black/40 border border-white/10 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 transition-colors";

  if (status === 'success') {
    return (
      <section id="candidatura" className="section-deferred py-20 md:py-28 px-4 bg-black relative overflow-hidden">
        <div className="ambient-orb w-[560px] h-[560px] bg-brand-green/8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <Reveal className="max-w-2xl mx-auto text-center relative z-10">
          <div className="rounded-2xl border border-brand-green/25 bg-black/78 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.62),0_0_48px_rgba(0,178,16,0.13)] backdrop-blur-xl md:p-12">
            <div className="w-20 h-20 rounded-full bg-brand-green/15 border border-brand-green/25 shadow-[0_0_34px_rgba(0,178,16,0.24)] flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-brand-green" />
            </div>
            <h2 className="font-heading font-black text-3xl md:text-4xl tracking-tight mb-4">
              Sua vaga está reservada.
            </h2>
            <p className="text-gray-300 text-lg mb-2">
              Em até <strong className="text-white">24h</strong>, nosso time da X5 Med entra em contato pelo WhatsApp para confirmar seu acesso e liberar a <strong className="text-brand-orange">condição mais especial da história da imersão</strong>.
            </p>
            <p className="text-gray-500 text-sm">
              Fique de olho no WhatsApp — as vagas são limitadas e trabalhamos por ordem de chegada.
            </p>
          </div>
        </Reveal>
      </section>
    );
  }

  return (
      <section id="candidatura" className="section-deferred py-16 md:py-20 px-4 bg-black relative overflow-hidden">
      <div className="ambient-orb w-[560px] h-[560px] bg-brand-orange/7 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

      <Reveal>
        <div className="max-w-3xl mx-auto text-center mb-12 relative z-10">
          <span className="inline-block bg-brand-orange/10 text-brand-orange text-xs md:text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-brand-orange/20">
            Últimas vagas · Condição inédita
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6 leading-tight">
            Reserve sua vaga e garanta a <ShimmerText>condição mais especial da história da imersão.</ShimmerText>
          </h2>
          <div className="text-gray-400 text-lg space-y-4">
            <p>Nesta edição online e ao vivo, a X5 Med preparou a <strong className="text-white">condição mais acessível que já ofereceu</strong>, uma <strong className="text-white">taxa simbólica de comprometimento</strong>.</p>
            <p className="text-white font-semibold bg-white/5 inline-block px-6 py-3 rounded-full mt-2 border border-white/10 text-base">
              Preencha os dados essenciais. Nosso time entra em contato para confirmar seu perfil, explicar o valor da condição online e liberar o acesso.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto rounded-2xl border border-brand-orange/20 bg-black/72 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.58),0_0_42px_rgba(237,140,0,0.1)] backdrop-blur-xl md:p-10 relative z-10 space-y-5"
          aria-describedby="form-privacy form-status"
        >
          <div>
            <label htmlFor="nome" className="block text-sm font-semibold text-gray-300 mb-2">Nome completo</label>
            <input
              id="nome"
              required
              name="nome"
              autoComplete="name"
              value={form.nome}
              onChange={handleChange}
              className={fieldClassName}
              placeholder="Dr(a). Seu nome"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">E-mail</label>
              <input
                id="email"
                required
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className={fieldClassName}
                placeholder="voce@clinica.com.br"
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-300 mb-2">WhatsApp</label>
              <input
                id="whatsapp"
                required
                type="tel"
                name="whatsapp"
                autoComplete="tel"
                inputMode="tel"
                value={form.whatsapp}
                onChange={handleChange}
                className={fieldClassName}
                placeholder="(11) 90000-0000"
              />
            </div>
          </div>

          <div>
            <label htmlFor="faturamento" className="block text-sm font-semibold text-gray-300 mb-2">Faixa de faturamento mensal da sua clínica</label>
            <select
              id="faturamento"
              required
              name="faturamento"
              value={form.faturamento}
              onChange={handleChange}
              className={fieldClassName}
            >
              <option value="">Selecione uma faixa</option>
              <option value="ate-30k">Até R$ 30 mil</option>
              <option value="30-70k">R$ 30 mil a R$ 70 mil</option>
              <option value="70-150k">R$ 70 mil a R$ 150 mil</option>
              <option value="150-300k">R$ 150 mil a R$ 300 mil</option>
              <option value="300k+">Acima de R$ 300 mil</option>
              <option value="ainda-nao-tenho">Ainda não tenho clínica própria</option>
            </select>
            <p className="mt-2 text-xs text-gray-500">
              Usamos essa informação apenas para direcionar a conversa ao seu momento atual.
            </p>
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            aria-busy={status === 'submitting'}
            className="btn-base btn-primary w-full py-4 text-lg disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
          >
            {status === 'submitting' ? 'RESERVANDO...' : 'RESERVAR MINHA VAGA'}
            {status !== 'submitting' && <ArrowRight className="w-5 h-5 ml-2 inline" />}
          </button>

          <div id="form-status" aria-live="polite" className="min-h-5">
            {status === 'error' && errorMsg && (
              <p className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200 shadow-[0_0_28px_rgba(239,68,68,0.12)]">{errorMsg}</p>
            )}
          </div>

          <p id="form-privacy" className="text-center text-xs text-gray-500 flex items-center justify-center gap-2 pt-2">
            <ShieldCheck className="w-4 h-4 text-brand-green" />
            Seus dados são tratados com sigilo. Usamos apenas para entrar em contato sobre a imersão.
          </p>
        </form>
      </Reveal>

      <p className="text-center text-gray-500 uppercase tracking-widest mt-10 text-xs md:text-sm">
        Vagas limitadas · Contato do time em até 24h · Domingo, 14 de junho
      </p>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "A imersão será realmente ao vivo?",
      a: "Sim. A Imersão X5 Med Online acontecerá ao vivo, em um domingo inteiro de conteúdo intensivo — no dia 14 de junho."
    },
    {
      q: "A imersão é apenas para médicos com clínica grande?",
      a: "Não. Ela serve tanto para médicos que estão estruturando crescimento quanto para quem já fatura e quer organizar expansão com mais inteligência."
    },
    {
      q: "O foco é só marketing?",
      a: "Não. O evento aborda mentalidade, atração, conversão, expansão e visão técnica estratégica. O objetivo é empresarial."
    },
    {
      q: "Por que o valor é explicado pelo time?",
      a: "Porque esta edição trabalha com uma condição especial da versão online e ao vivo. O contato serve para confirmar seu perfil, orientar o acesso e explicar a taxa simbólica com clareza antes da confirmação."
    },
    {
      q: "Existe taxa simbólica de comprometimento?",
      a: "Sim. A taxa existe para reservar a vaga de médicos realmente comprometidos com a própria evolução empresarial. Ela é apresentada pelo time no contato de confirmação."
    },
    {
      q: "Como funciona o processo de inscrição?",
      a: "Você preenche o formulário e nosso time comercial da X5 Med entra em contato em até 24h via WhatsApp para entender o seu momento e confirmar o acesso à imersão. As vagas são limitadas e analisadas por ordem de aplicação."
    },
    {
      q: "Posso participar com sócio ou gestor?",
      a: "Sim. Indique isso no contato com o nosso time — temos condições específicas para quem quer levar sócios, cônjuge gestor ou administrador da clínica para acelerar a implementação."
    },
    {
      q: "Vai existir oferta de mentoria ao final?",
      a: "Pode existir uma oportunidade para quem quiser aprofundar a implementação com acompanhamento próximo. A imersão, por si só, foi estruturada para entregar clareza e aplicação prática em 1 dia."
    },
    {
      q: "Essa imersão serve para qualquer especialidade?",
      a: "Sim. Os princípios de posicionamento, conversão, gestão e expansão se aplicam ao crescimento empresarial de clínicas e consultórios em diferentes especialidades."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-deferred py-16 md:py-20 px-4 bg-brand-dark">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight text-center mb-16">Perguntas Frequentes</h2>
        </Reveal>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className={`overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 ${openIndex === i ? 'border-brand-orange/25 bg-black/72 shadow-[0_18px_58px_rgba(0,0,0,0.46),0_0_34px_rgba(237,140,0,0.1)]' : 'border-white/10 bg-white/[0.025]'}`}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-answer-${i}`}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-orange"
                >
                  <span className="font-bold text-lg pr-8">{faq.q}</span>
                  {openIndex === i ? <ChevronUp className="text-brand-orange shrink-0" /> : <ChevronDown className="text-gray-500 shrink-0" />}
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div id={`faq-answer-${i}`} className="p-6 pt-0 text-gray-300 leading-relaxed border-t border-brand-orange/10 mt-2">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bonus() {
  return (
    <section className="section-deferred py-16 md:py-20 px-4 bg-brand-orange text-brand-darker">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left Side: Copy + CTA */}
        <Reveal className="md:w-1/2 flex flex-col items-start w-full">
          <h2 className="font-heading font-black text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6 uppercase">
            Bônus para quem decide rápido
          </h2>
          <p className="text-xl font-medium mb-6">
            Médicos que crescem não ficam eternamente analisando. Eles tomam decisões.
          </p>
          <p className="text-lg mb-8">
            Por isso, os primeiros inscritos terão acesso a um bônus exclusivo de implementação.
          </p>
          <Button href={CTA_LINK} className="w-full sm:w-auto bg-brand-darker text-base md:text-lg shadow-[0_12px_28px_rgba(0,0,0,0.28)] hover:shadow-[0_16px_38px_rgba(0,0,0,0.34)]">
            {primaryCtaText}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Reveal>

        {/* Right Side: Bonus Card */}
        <Reveal className="md:w-1/2 w-full flex justify-center" delay={0.2}>
          <div className="bg-brand-darker text-white p-8 rounded-2xl shadow-2xl transform md:rotate-2 w-full">
            <div className="flex items-center gap-3 mb-4 text-brand-orange">
              <Star className="w-8 h-8 fill-current shrink-0" />
              <h3 className="font-bold text-2xl uppercase tracking-wider">Bônus VIP de Implementação</h3>
            </div>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              Uma sessão extra com os especialistas para mostrar, na prática, como aplicar os conceitos da imersão na realidade da sua clínica.
            </p>
            <div className="bg-brand-orange/10 border border-brand-orange/20 p-4 rounded-xl">
              <p className="font-bold text-lg text-brand-orange">Não é conteúdo decorativo. É aceleração.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}


function Footer() {
  return (
    <footer className="bg-brand-darker pt-20 pb-10 px-4 text-center border-t border-brand-orange/20">
      <Reveal>
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="font-heading font-black text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
            Você já fez o mais difícil: se tornar um grande médico.<br/>
            <ShimmerText>Agora é hora de se tornar empresário da sua própria clínica.</ShimmerText>
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Garanta sua vaga na Imersão X5 Med Online e descubra como crescer com mais lucro, mais previsibilidade e menos dependência do improviso.
          </p>

          <div className="flex items-center justify-center mb-8">
            <Button href={CTA_LINK} className="w-full sm:w-auto">RESERVAR MINHA VAGA</Button>
          </div>

          <p className="text-sm text-gray-500 uppercase tracking-widest">
            Domingo, 14 de junho | 100% Online e Ao Vivo | Vagas limitadas
          </p>
        </div>
      </Reveal>

      <div className="text-gray-600 text-sm mt-24 border-t border-white/5 pt-8">
        <p>&copy; {new Date().getFullYear()} X5 Med. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-black font-sans selection:bg-brand-orange selection:text-white">
      <div className="fire-glow-overlay" aria-hidden="true"></div>
      <TopBar />
      <StickyBar />
      <HeroWideImage />
      <Identification />
      <Pain />
      <Solution />
      <Pillars />
      <WhatYouWillLearn />
      <TargetAudience />
      <Authority />
      <SocialProof />
      <BeliefBreaking />
      <DecisionBridge />
      <Candidatura />
      <Bonus />
      <FAQ />
      <Footer />
    </div>
  );
}
