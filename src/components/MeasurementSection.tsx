import React from 'react';
import { ReadingDepth } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldAlert, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ArrowDown,
  Info
} from 'lucide-react';
import { GlossaryBadge } from './GlossaryBadge';
import { SectionHeader } from './SectionHeader';

interface MeasurementSectionProps {
  readingDepth: ReadingDepth;
  isHighlighted?: boolean;
  onToggleHighlight?: (id: string) => void;
}

export const MeasurementSection: React.FC<MeasurementSectionProps> = ({ 
  readingDepth,
  isHighlighted,
  onToggleHighlight
}) => {
  return (
    <section 
      id="measurement" 
      className={`py-12 sm:py-16 border-b border-[#DCE4EE] dark:border-slate-800 transition-colors ${
        isHighlighted ? 'section-highlighted' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Copy Link & Highlight */}
        <SectionHeader
          num="10"
          category="Causal Measurement Architecture"
          sectionId="measurement"
          isHighlighted={isHighlighted}
          onToggleHighlight={onToggleHighlight}
          title={<span>Measurement: prove incrementality, not activity.</span>}
          description={
            <span>
              The primary outcome is <strong>incremental tracked orders per eligible existing user</strong>, measured via a persistent <GlossaryBadge termKey="ITT">50/50 Intention-To-Treat (ITT)</GlossaryBadge> holdout. We never optimize on vanity installs or un-attributed clicks.
            </span>
          }
        />

        {/* Counterfactual Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Treatment Holdout Box */}
          <div className="lg:col-span-6 bg-white dark:bg-[#0E1726] border border-[#DCE4EE] dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#316BEA]"></span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">Treatment Group (50%)</h3>
              </div>
              <span className="text-xs font-mono bg-blue-50 dark:bg-blue-950/60 text-[#316BEA] dark:text-blue-300 px-2 py-0.5 rounded font-bold">
                Intent Router Assigned
              </span>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Consented eligible users assigned to receive the extension. Users remain in this cohort whether they install, dismiss, or activate, eliminating opt-in bias.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
              <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Observed Mean Orders:</div>
              <div className="text-sm font-bold text-[#316BEA] dark:text-blue-400">O_treatment = Mean(Tracked Orders / User)</div>
            </div>
          </div>

          {/* Control Counterfactual Box */}
          <div className="lg:col-span-6 bg-white dark:bg-[#0E1726] border border-[#DCE4EE] dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">Control Group (50%)</h3>
              </div>
              <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-bold">
                Normal Natural Journey
              </span>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Identical, stratified cohort experiencing the normal shopping journey without the extension. Approximates the true un-intervened counterfactual.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
              <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Counterfactual Baseline:</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">O_control = Mean(Tracked Orders / User)</div>
            </div>
          </div>
        </div>

        {/* Incremental Formula Callout */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-slate-900 text-white border border-blue-800 shadow-md mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-300 font-bold block mb-1">
                Core Causal Lift Formula (ITT)
              </span>
              <div className="text-lg sm:text-xl font-mono font-bold text-white">
                ΔO = O_treatment − O_control
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Reported with two-sided 95% Confidence Interval after <GlossaryBadge termKey="S2S Postback">postback</GlossaryBadge> maturation window.
              </p>
            </div>
            <div className="sm:text-right">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                Quarterly Fixed Cohort Contribution
              </span>
              <div className="text-base font-mono font-bold text-emerald-300">
                ΔContribution = E × ΔO × C
              </div>
              <span className="text-[11px] text-slate-400">Where C = Net commission margin less cashback & costs</span>
            </div>
          </div>
        </div>

        {/* Metric Hierarchy Scientific Instrument Panel */}
        <div className="bg-white dark:bg-[#0E1726] border border-[#DCE4EE] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm mb-8">
          <div className="p-4 sm:p-5 bg-[#0B1728] dark:bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#316BEA] font-semibold">
                Scientific Metric Architecture
              </span>
              <h3 className="text-base font-bold text-white">Metric Layers & Decision Functions</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">4-Tier System</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            
            {/* Level 1: North Star */}
            <div className="p-4 sm:p-5 bg-blue-50/40 dark:bg-blue-950/20 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-3">
                <span className="font-mono text-[10px] font-bold uppercase text-[#316BEA] dark:text-blue-400 block">1. North Star (ITT)</span>
                <strong className="text-sm text-slate-900 dark:text-white font-display">Incremental Tracked Orders / Eligible User</strong>
              </div>
              <div className="md:col-span-5 text-slate-600 dark:text-slate-300">
                The causal difference between treatment and control cohorts over the test window.
              </div>
              <div className="md:col-span-4 font-mono font-semibold text-[#316BEA] dark:text-blue-400">
                Report absolute lift & 95% CI; drives scale/kill decision.
              </div>
            </div>

            {/* Level 2: Diagnostic Funnel */}
            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-3">
                <span className="font-mono text-[10px] font-bold uppercase text-slate-400 block">2. Diagnostic Funnel</span>
                <strong className="text-sm text-slate-900 dark:text-white font-display">Eligible Visits → Prompts → Activations → Orders</strong>
              </div>
              <div className="md:col-span-5 text-slate-600 dark:text-slate-300">
                Isolates funnel bottlenecks (reach, relevance, activation, postback match).
              </div>
              <div className="md:col-span-4 text-slate-500 dark:text-slate-400 italic">
                Diagnostics only. NEVER substitute for North Star.
              </div>
            </div>

            {/* Level 3: Business Quality */}
            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-3">
                <span className="font-mono text-[10px] font-bold uppercase text-slate-400 block">3. Business Quality</span>
                <strong className="text-sm text-slate-900 dark:text-white font-display">Net Commission Contribution & GMV</strong>
              </div>
              <div className="md:col-span-5 text-slate-600 dark:text-slate-300">
                Net affiliate commission less cashback payouts, partner rev-share, and disputes.
              </div>
              <div className="md:col-span-4 text-slate-700 dark:text-slate-300 font-medium">
                Separates true incremental revenue from subsidized channel shift.
              </div>
            </div>

            {/* Level 4: Guardrails */}
            <div className="p-4 sm:p-5 bg-rose-50/30 dark:bg-rose-950/20 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-3">
                <span className="font-mono text-[10px] font-bold uppercase text-rose-600 dark:text-rose-400 block">4. Guardrails</span>
                <strong className="text-sm text-slate-900 dark:text-white font-display">Attribution, Uninstalls & Partner Disputes</strong>
              </div>
              <div className="md:col-span-5 text-slate-600 dark:text-slate-300">
                Uninstalls, support complaints, affiliate postback mismatch, partner objections.
              </div>
              <div className="md:col-span-4 text-rose-700 dark:text-rose-300 font-bold">
                Automated halt on proposed operating target breach.
              </div>
            </div>

          </div>

          <div className="p-4 bg-slate-900 dark:bg-slate-950 text-slate-300 text-xs flex items-center justify-between border-t border-slate-800">
            <span className="font-bold text-white">Production Telemetry Rule:</span>
            <span className="font-mono text-[#316BEA] dark:text-blue-400">Do NOT optimize on vanity extension installs, clicks, or gross assisted orders.</span>
          </div>
        </div>

      </div>
    </section>
  );
};

