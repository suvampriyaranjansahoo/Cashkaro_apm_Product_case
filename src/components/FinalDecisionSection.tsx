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
import { SectionHeader } from './SectionHeader';

interface FinalDecisionSectionProps {
  readingDepth: ReadingDepth;
  onOpenRecruiterHub?: () => void;
  isHighlighted?: boolean;
  onToggleHighlight?: (id: string) => void;
}

export const FinalDecisionSection: React.FC<FinalDecisionSectionProps> = ({ 
  readingDepth,
  onOpenRecruiterHub,
  isHighlighted,
  onToggleHighlight
}) => {
  return (
    <section 
      id="final-decision" 
      className={`py-16 sm:py-24 bg-white dark:bg-[#070D18] border-b border-[#DCE4EE] dark:border-slate-800 transition-colors ${
        isHighlighted ? 'section-highlighted' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Copy Link & Highlight */}
        <SectionHeader
          num="13"
          category="Final Synthesis"
          sectionId="final-decision"
          isHighlighted={isHighlighted}
          onToggleHighlight={onToggleHighlight}
          title={<span>FINAL PRODUCT DECISION</span>}
          description={
            <span>
              The complete investment thesis synthesized into three operational mandates.
            </span>
          }
        />

        {/* 3 Large Decision Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* BUILD */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0E1726] border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#316BEA] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-100 dark:border-blue-900/60">
                1. BUILD
              </span>
              <span className="text-[10px] font-mono text-slate-400">Execution Bet</span>
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Validate G1–G3, Then Launch Narrow Intent Router
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Desktop-first Chrome extension targeting validated high-frequency leakage users across 3–5 partner retailers. Explicit activation only; zero cart disruption.
            </p>
          </div>

          {/* MEASURE */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0E1726] border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#159A68] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-900/60">
                2. MEASURE
              </span>
              <span className="text-[10px] font-mono text-slate-400">Causal Proof</span>
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Incremental Tracked Orders Per Eligible Existing User (ITT)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Evaluated via persistent 50/50 ITT holdout after postback maturation. Never optimize vanity extension installs, clicks, or gross assisted orders.
            </p>
          </div>

          {/* SCALE / KILL */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0E1726] border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#BD3B34] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-md border border-rose-100 dark:border-rose-900/60">
                3. SCALE / KILL
              </span>
              <span className="text-[10px] font-mono text-slate-400">Investment Gate</span>
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Scale Only With Clear Economic Lift & Healthy Guardrails
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Scale only if conservative contribution clears one-time and recurring costs (Kf + Kr1). Kill / redirect if discovery fails, lift is absent, or trust degrades.
            </p>
          </div>

        </div>

        {/* Signature High-Impact Closing Quote */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0B1728] dark:bg-slate-950 text-white border border-slate-800 shadow-2xl mb-12 relative overflow-hidden text-center sm:text-left">
          <div className="max-w-4xl mx-auto space-y-4">
            <Quote className="w-10 h-10 text-[#316BEA] mx-auto sm:mx-0 opacity-75" />
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-slate-100 leading-snug">
              "Do not scale a feature because the funnel moved; scale only when the mechanism creates incremental tracked orders safely and economically."
            </blockquote>
            <div className="pt-2 text-xs font-mono text-slate-400">
              — <span className="text-white font-semibold">Suvam Priyaranjan Sahoo</span>, APM Product Case Submission
            </div>
          </div>
        </div>

        {/* Candidate Evaluation & Hiring Manager Brief Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-[#10243e] to-slate-950 text-white border border-slate-700/80 shadow-xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono text-xs font-bold border border-blue-500/30">
              <span>APM CANDIDATE EVALUATION</span>
              <span>•</span>
              <span className="text-emerald-400">READY FOR INTERVIEW</span>
            </div>
            <h3 className="text-2xl font-extrabold font-display text-white">
              Suvam Priyaranjan Sahoo
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Applying for <strong>Associate Product Manager (APM)</strong> at CashKaro / Pouring Pounds. Passionate about applying causal experiment design, econometric analysis, and thoughtful product craft to drive incremental growth.
            </p>
            <div className="text-xs text-[#38BDF8] font-mono pt-1">
              Email: <a href="mailto:sahoosuvampriyaranjan10@gmail.com" className="underline font-semibold">sahoosuvampriyaranjan10@gmail.com</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
            {onOpenRecruiterHub && (
              <button
                onClick={onOpenRecruiterHub}
                className="px-5 py-3 rounded-xl bg-[#316BEA] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Open Recruiter Hub & Rubric</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
            <a
              href="mailto:sahoosuvampriyaranjan10@gmail.com?subject=CashKaro%20APM%20Interview%20-%20Suvam%20Priyaranjan%20Sahoo"
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors text-center"
            >
              <span>Schedule APM Discussion</span>
              <Send className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Evidence & AI Transparency Footer Box */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-4">
          <div className="flex items-center gap-2 font-mono font-bold text-slate-900 dark:text-white uppercase">
            <ShieldCheck className="w-4 h-4 text-[#316BEA]" />
            <span>Evidence & AI Transparency Protocol</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-[11px]">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white block mb-1">PROVIDED</strong>
              Assignment brief, Product Intern JD, and original problem prompt.
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white block mb-1">SIMULATED</strong>
              Synthetic RFM-style cohort; strictly excluded from sizing or financial claims.
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white block mb-1">INFERRED</strong>
              Routing-friction hypothesis and archetype behavioral mappings.
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white block mb-1">TO VALIDATE</strong>
              All CashKaro causal claims through G1–G4 experimental gates.
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white block mb-1">AI USAGE</strong>
              Assisted structure, critique, interactive design, and drafting.
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
            <span>Sources: CashKaro APM Assignment PDF • Product Intern JD • Original Strategy Memo</span>
            <span>Document Complete • Ready for Evaluation</span>
          </div>
        </div>

      </div>
    </section>
  );
};

