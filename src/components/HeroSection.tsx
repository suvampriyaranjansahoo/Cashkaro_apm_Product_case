import React, { useState } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  Cpu, 
  Target, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Maximize2,
  ChevronDown,
  FileDown
} from 'lucide-react';
import { ReadingDepth } from '../types';
import { ColorLegend } from './ColorLegend';

interface HeroSectionProps {
  readingDepth: ReadingDepth;
  onOpenRecruiterHub?: () => void;
  onOpenPdfExport?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ readingDepth, onOpenRecruiterHub, onOpenPdfExport }) => {
  const [activeDecisionStep, setActiveDecisionStep] = useState<number>(3);

  const decisionSteps = [
    {
      num: '01',
      title: 'Observed Leakage',
      subtitle: 'Direct retailer purchase',
      detail: 'Existing CashKaro users bypass the platform and complete purchases directly on partner retailers without tracking.',
      status: 'Observation',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    },
    {
      num: '02',
      title: 'Routing Hypothesis',
      subtitle: 'Late recall / restart friction',
      detail: 'Users know and desire cashback, but remember it only after arriving on the retailer site. Navigating back feels too costly.',
      status: 'Hypothesis',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      num: '03',
      title: 'Validation Gates',
      subtitle: 'G1 → G2 → G3',
      detail: 'G1 Problem Discovery (≥60% pass) → G2 Reach / Addressability → G3 Instrumentability & Attribution spikes before full build.',
      status: 'Gating Requirement',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      num: '04',
      title: 'Intent Router',
      subtitle: 'Desktop Chrome V1',
      detail: 'Consented extension injecting a clean affiliate activation path on 3–5 eligible retailers without cart disturbance.',
      status: 'Product Bet',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      num: '05',
      title: 'Persistent 50/50 ITT',
      subtitle: 'Clean counterfactual',
      detail: 'Pre-registered user-level Intention-To-Treat holdout. Users remain in assigned cohort regardless of install/activation.',
      status: 'Causal Proof',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      num: '06',
      title: 'Incremental Orders',
      subtitle: 'Business North Star',
      detail: 'Incremental tracked orders per eligible existing user per quarter. Never optimize vanity clicks or assisted journeys.',
      status: 'Outcome',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      num: '07',
      title: 'Scale / Iterate / Kill',
      subtitle: 'Zero-dogma decision',
      detail: 'Scale only if conservative contribution clears one-time build (Kf) and recurring operating costs (Kr1) with healthy guardrails.',
      status: 'Investment Rule',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    },
  ];

  return (
    <section id="hero" className="pt-4 pb-12 sm:pb-16 border-b border-[#DCE4EE] dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Eyebrow */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 dark:bg-slate-800 text-slate-200 text-xs font-semibold tracking-wider uppercase border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-[#316BEA] animate-pulse"></span>
            CashKaro / APM Product Strategy Case
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Author: <strong className="text-slate-800 dark:text-slate-200 font-semibold">SUVAM PRIYARANJAN SAHOO</strong></span>
            <span>•</span>
            <span>Status: <strong className="text-[#159A68] dark:text-emerald-400 font-semibold">Validated Strategy</strong></span>
          </div>
        </div>

        {/* 2-Column Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          
          {/* Left Column: Strategic Pitch & Badges */}
          <div className="lg:col-span-7 space-y-6">
            
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight text-[#0B1F3A] dark:text-white leading-[1.15]">
                Making CashKaro part of the shopping habit.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                A hypothesis-led product strategy to convert <span className="font-semibold text-slate-900 dark:text-white">existing-user leakage</span> into <span className="font-semibold text-[#316BEA] dark:text-blue-400">incremental tracked orders</span> through an intention-routed, friction-free mechanism.
              </p>
            </div>

            {/* Senior PM Triad Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#0E1726] border border-[#DCE4EE] dark:border-slate-800 text-xs font-bold text-[#0B1F3A] dark:text-slate-200 shadow-xs">
                <Target className="w-3.5 h-3.5 text-[#316BEA]" />
                <span>USER VALUE</span>
                <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">Zero-restart routing</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#0E1726] border border-[#DCE4EE] dark:border-slate-800 text-xs font-bold text-[#0B1F3A] dark:text-slate-200 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#159A68]" />
                <span>CAUSALITY</span>
                <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">Persistent 50/50 ITT</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#0E1726] border border-[#DCE4EE] dark:border-slate-800 text-xs font-bold text-[#0B1F3A] dark:text-slate-200 shadow-xs">
                <TrendingUp className="w-3.5 h-3.5 text-[#316BEA]" />
                <span>ECONOMICS</span>
                <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">Break-even ΔO model</span>
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#EBF2FE] to-white dark:from-blue-950/40 dark:to-slate-900 border border-[#C6DCFD] dark:border-blue-900/50 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-[#316BEA] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
                  REC
                </div>
                <div className="space-y-1">
                  <h2 className="text-xs font-bold tracking-wider uppercase text-[#316BEA] dark:text-blue-300">
                    Primary Executive Recommendation
                  </h2>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-snug">
                    Validate routing friction among high-frequency leakage users before writing code (<strong>G1 ≥ 60%</strong>). If the evidence holds, launch a narrow, desktop-first <strong>Intent Router</strong> on 3–5 eligible retailers. Treat mobile recovery as V1.5 and trust as a launch guardrail — <em>never an untested assumption</em>.
                  </p>
                </div>
              </div>
            </div>

            {/* Recruiter & Hiring Manager Evaluation Banner */}
            {onOpenRecruiterHub && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0B1728] via-[#132845] to-[#0B1728] text-white border border-slate-700/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-sm shrink-0 shadow-sm mt-0.5">
                    APM
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-white">
                        Hiring Manager / Recruiter Fast-Track
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30">
                        5/5 Rubric
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-snug">
                      Candidate: <strong>Suvam Priyaranjan Sahoo</strong> • Evaluated across Product Sense, Causality, System Design, and Break-Even Unit Economics.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  {onOpenPdfExport && (
                    <button
                      onClick={onOpenPdfExport}
                      className="px-3 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer border border-emerald-400/40"
                      title="Download Strategy Memo as PDF"
                    >
                      <FileDown className="w-3.5 h-3.5 text-white" />
                      <span>Download PDF</span>
                    </button>
                  )}
                  <button
                    onClick={onOpenRecruiterHub}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#316BEA] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <span>Evaluation Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Evidence Boundary Callout */}
            <div className="p-3.5 rounded-lg bg-slate-100/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 dark:text-slate-200">Evidence Boundary & Integrity:</strong> No synthetic segment size, interview result, baseline conversion rate, or financial forecast is presented as CashKaro fact. The case articulates what must be proven before capital and engineering are deployed.
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Decision Spine Card */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0B1728] text-slate-900 dark:text-white rounded-2xl p-5 sm:p-6 border border-[#DEB6C5]/70 dark:border-slate-800 shadow-md dark:shadow-xl relative overflow-hidden transition-colors">
            <div className="flex items-center justify-between border-b border-[#F0D6DE] dark:border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] tracking-widest font-mono uppercase text-[#D190AC] dark:text-[#25C3FF] font-bold">Strategic Spine</span>
                <h2 className="text-base font-display font-bold text-slate-900 dark:text-white">The Product Decision Path</h2>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F7F6ED] dark:bg-slate-800 text-[#0B1F3A] dark:text-slate-300 border border-[#DEB6C5]/40 dark:border-slate-700">
                Interactive (7 Steps)
              </span>
            </div>

            {/* Step Selector Pipeline */}
            <div className="space-y-2 mb-5">
              {decisionSteps.map((step, idx) => {
                const isCurrent = activeDecisionStep === idx;
                return (
                  <button
                    key={step.num}
                    onClick={() => setActiveDecisionStep(idx)}
                    className={`w-full text-left p-2.5 rounded-lg transition-all flex items-center justify-between group cursor-pointer border ${
                      isCurrent
                        ? 'bg-gradient-to-r from-[#D190AC] to-[#DEB6C5] dark:from-[#0080AB] dark:to-[#00AFD3] text-white shadow-sm border-transparent'
                        : 'bg-[#F7F6ED]/70 dark:bg-slate-900/80 hover:bg-[#F0EAD5] dark:hover:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-[#DEB6C5]/30 dark:border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] font-bold ${
                        isCurrent ? 'bg-white text-[#D190AC] dark:text-[#0080AB]' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white border border-[#DEB6C5]/40 dark:border-slate-700'
                      }`}>
                        {step.num}
                      </span>
                      <div>
                        <div className="text-xs font-semibold leading-tight">{step.title}</div>
                        <div className={`text-[10px] leading-none mt-0.5 ${isCurrent ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
                          {step.subtitle}
                        </div>
                      </div>
                    </div>
                    
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      isCurrent ? 'bg-white/20 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-[#DEB6C5]/30 dark:border-slate-700'
                    }`}>
                      {step.status}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Step Inspector Card */}
            <div className="bg-[#F7F6ED] dark:bg-slate-900 border border-[#DEB6C5]/60 dark:border-slate-800 rounded-xl p-4 transition-all shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold">Step {decisionSteps[activeDecisionStep].num} Deep Dive</span>
                <span className="text-xs font-bold text-[#D190AC] dark:text-[#25C3FF]">
                  {decisionSteps[activeDecisionStep].title}
                </span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {decisionSteps[activeDecisionStep].detail}
              </p>
            </div>
          </div>
        </div>

        {/* Global Color Legend */}
        <ColorLegend />

      </div>
    </section>
  );
};

