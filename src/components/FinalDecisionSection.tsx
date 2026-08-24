import React from 'react';
import { ReadingDepth } from '../types';
import { 
  CheckCircle2, 
  Quote, 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  BookOpen,
  Send
} from 'lucide-react';

interface FinalDecisionSectionProps {
  readingDepth: ReadingDepth;
}

export const FinalDecisionSection: React.FC<FinalDecisionSectionProps> = ({ readingDepth }) => {
  return (
    <section id="final-decision" className="py-16 sm:py-24 bg-white border-b border-[#DCE4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#316BEA] tracking-wider mb-2">
            <span>13</span>
            <span>/</span>
            <span>Final Synthesis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-[#0B1F3A] tracking-tight">
            FINAL PRODUCT DECISION
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            The complete investment thesis synthesized into three operational mandates.
          </p>
        </div>

        {/* 3 Large Decision Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* BUILD */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#316BEA] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                1. BUILD
              </span>
              <span className="text-[10px] font-mono text-slate-400">Execution Bet</span>
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Validate G1–G3, Then Launch Narrow Intent Router
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Desktop-first Chrome extension targeting validated high-frequency leakage users across 3–5 partner retailers. Explicit activation only; zero cart disruption.
            </p>
          </div>

          {/* MEASURE */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#159A68] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                2. MEASURE
              </span>
              <span className="text-[10px] font-mono text-slate-400">Causal Proof</span>
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Incremental Tracked Orders Per Eligible Existing User (ITT)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Evaluated via persistent 50/50 ITT holdout after postback maturation. Never optimize vanity extension installs, clicks, or gross assisted orders.
            </p>
          </div>

          {/* SCALE / KILL */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#BD3B34] bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
                3. SCALE / KILL
              </span>
              <span className="text-[10px] font-mono text-slate-400">Investment Gate</span>
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Scale Only With Clear Economic Lift & Healthy Guardrails
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Scale only if conservative contribution clears one-time and recurring costs (Kf + Kr1). Kill / redirect if discovery fails, lift is absent, or trust degrades.
            </p>
          </div>

        </div>

        {/* Signature High-Impact Closing Quote */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0B1728] text-white border border-slate-800 shadow-2xl mb-12 relative overflow-hidden text-center sm:text-left">
          <div className="max-w-4xl mx-auto space-y-4">
            <Quote className="w-10 h-10 text-[#316BEA] mx-auto sm:mx-0 opacity-75" />
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-slate-100 leading-snug">
              "Do not scale a feature because the funnel moved; scale only when the mechanism creates incremental tracked orders safely and economically."
            </blockquote>
            <div className="pt-2 text-xs font-mono text-slate-400">
              — <span className="text-white font-semibold">Suvam Priya Ranjan Sahoo</span>, APM Product Case Submission
            </div>
          </div>
        </div>

        {/* Evidence & AI Transparency Footer Box */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-4">
          <div className="flex items-center gap-2 font-mono font-bold text-slate-900 uppercase">
            <ShieldCheck className="w-4 h-4 text-[#316BEA]" />
            <span>Evidence & AI Transparency Protocol</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-[11px]">
            <div className="p-3 bg-white rounded-lg border border-slate-200/80">
              <strong className="text-slate-900 block mb-1">PROVIDED</strong>
              Assignment brief, Product Intern JD, and original problem prompt.
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200/80">
              <strong className="text-slate-900 block mb-1">SIMULATED</strong>
              Synthetic RFM-style cohort; strictly excluded from sizing or financial claims.
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200/80">
              <strong className="text-slate-900 block mb-1">INFERRED</strong>
              Routing-friction hypothesis and archetype behavioral mappings.
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200/80">
              <strong className="text-slate-900 block mb-1">TO VALIDATE</strong>
              All CashKaro causal claims through G1–G4 experimental gates.
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200/80">
              <strong className="text-slate-900 block mb-1">AI USAGE</strong>
              Assisted structure, critique, interactive design, and drafting.
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-slate-500 font-mono text-[11px]">
            <span>Sources: CashKaro APM Assignment PDF • Product Intern JD • Original Strategy Memo</span>
            <span>Document Complete • Ready for Evaluation</span>
          </div>
        </div>

      </div>
    </section>
  );
};
