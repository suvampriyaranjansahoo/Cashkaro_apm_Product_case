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

interface MeasurementSectionProps {
  readingDepth: ReadingDepth;
}

export const MeasurementSection: React.FC<MeasurementSectionProps> = ({ readingDepth }) => {
  return (
    <section id="measurement" className="py-12 sm:py-16 border-b border-[#DCE4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#316BEA] tracking-wider mb-2">
            <span>10</span>
            <span>/</span>
            <span>Causal Measurement</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-[#0B1F3A] tracking-tight">
            Measurement: prove incrementality, not activity.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            The primary outcome is <strong>incremental tracked orders per eligible existing user</strong>, measured via a persistent 50/50 Intention-To-Treat (ITT) holdout. We never optimize on vanity installs or un-attributed clicks.
          </p>
        </div>

        {/* Counterfactual Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Treatment Holdout Box */}
          <div className="lg:col-span-6 bg-white border border-[#DCE4EE] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#316BEA]"></span>
                <h3 className="font-bold text-sm text-slate-900 font-display">Treatment Group (50%)</h3>
              </div>
              <span className="text-xs font-mono bg-blue-50 text-[#316BEA] px-2 py-0.5 rounded font-bold">
                Intent Router Assigned
              </span>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Consented eligible users assigned to receive the extension. Users remain in this cohort whether they install, dismiss, or activate.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1">
              <div className="text-slate-500 text-[10px] uppercase font-bold">Observed Mean Orders:</div>
              <div className="text-sm font-bold text-[#316BEA]">O_treatment = Mean(Tracked Orders / User)</div>
            </div>
          </div>

          {/* Control Counterfactual Box */}
          <div className="lg:col-span-6 bg-white border border-[#DCE4EE] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                <h3 className="font-bold text-sm text-slate-900 font-display">Control Group (50%)</h3>
              </div>
              <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                Normal Natural Journey
              </span>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Identical, stratified cohort experiencing the normal shopping journey without the extension. Approximates the true counterfactual.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1">
              <div className="text-slate-500 text-[10px] uppercase font-bold">Counterfactual Baseline:</div>
              <div className="text-sm font-bold text-slate-800">O_control = Mean(Tracked Orders / User)</div>
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
                Reported with two-sided 95% Confidence Interval after postback maturation window.
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
        <div className="bg-white border border-[#DCE4EE] rounded-2xl overflow-hidden shadow-sm mb-8">
          <div className="p-4 sm:p-5 bg-[#0B1728] text-white flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#316BEA] font-semibold">
                Scientific Metric Architecture
              </span>
              <h3 className="text-base font-bold text-white">Metric Layers & Decision Functions</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">4-Tier System</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            
            {/* Level 1: North Star */}
            <div className="p-4 sm:p-5 bg-blue-50/40 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-3">
                <span className="font-mono text-[10px] font-bold uppercase text-[#316BEA] block">1. North Star (ITT)</span>
                <strong className="text-sm text-slate-900 font-display">Incremental Tracked Orders / Eligible User</strong>
              </div>
              <div className="md:col-span-5 text-slate-600">
                The causal difference between treatment and control cohorts over the test window.
              </div>
              <div className="md:col-span-4 font-mono font-semibold text-[#316BEA]">
                Report absolute lift & 95% CI; drives scale/kill decision.
              </div>
            </div>

            {/* Level 2: Diagnostic Funnel */}
            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-3">
                <span className="font-mono text-[10px] font-bold uppercase text-slate-400 block">2. Diagnostic Funnel</span>
                <strong className="text-sm text-slate-900 font-display">Eligible Visits → Prompts → Activations → Orders</strong>
              </div>
              <div className="md:col-span-5 text-slate-600">
                Isolates funnel bottlenecks (reach, relevance, activation, postback match).
              </div>
              <div className="md:col-span-4 text-slate-500 italic">
                Diagnostics only. NEVER substitute for North Star.
              </div>
            </div>

            {/* Level 3: Business Quality */}
            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-3">
                <span className="font-mono text-[10px] font-bold uppercase text-slate-400 block">3. Business Quality</span>
                <strong className="text-sm text-slate-900 font-display">Net Commission Contribution & GMV</strong>
              </div>
              <div className="md:col-span-5 text-slate-600">
                Net affiliate commission less cashback payouts, partner rev-share, and disputes.
              </div>
              <div className="md:col-span-4 text-slate-700 font-medium">
                Separates true incremental revenue from subsidized channel shift.
              </div>
            </div>

            {/* Level 4: Guardrails */}
            <div className="p-4 sm:p-5 bg-rose-50/30 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-3">
                <span className="font-mono text-[10px] font-bold uppercase text-rose-600 block">4. Guardrails</span>
                <strong className="text-sm text-slate-900 font-display">Attribution, Uninstalls & Partner Disputes</strong>
              </div>
              <div className="md:col-span-5 text-slate-600">
                Uninstalls, support complaints, affiliate postback mismatch, partner objections.
              </div>
              <div className="md:col-span-4 text-rose-700 font-bold">
                Automated halt on proposed operating target breach.
              </div>
            </div>

          </div>

          <div className="p-4 bg-slate-900 text-slate-300 text-xs flex items-center justify-between border-t border-slate-800">
            <span className="font-bold text-white">Production Telemetry Rule:</span>
            <span className="font-mono text-[#316BEA]">Do NOT optimize on vanity extension installs, clicks, or gross assisted orders.</span>
          </div>
        </div>

      </div>
    </section>
  );
};
