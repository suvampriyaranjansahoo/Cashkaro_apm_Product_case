import React, { useState } from 'react';
import { HYPOTHESES } from '../data/caseData';
import { ReadingDepth } from '../types';
import { 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  ArrowRight, 
  Zap, 
  ShieldAlert, 
  Bookmark,
  Users,
  Info
} from 'lucide-react';

interface HypothesesSectionProps {
  readingDepth: ReadingDepth;
}

export const HypothesesSection: React.FC<HypothesesSectionProps> = ({ readingDepth }) => {
  const [selectedHypothesis, setSelectedHypothesis] = useState<string>('routing');

  const active = HYPOTHESES.find((h) => h.id === selectedHypothesis) || HYPOTHESES[0];

  return (
    <section id="hypotheses" className="py-12 sm:py-16 border-b border-[#DCE4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#316BEA] tracking-wider mb-2">
            <span>03</span>
            <span>/</span>
            <span>Competing Explanations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-[#0B1F3A] tracking-tight">
            Segment behaviors; do not label causes as facts.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Production segmentation should use consented first-party behavioral records (12-month frequency, recency, category concentration, support tickets). We formulate <strong>three competing hypotheses</strong> before committing to an engineering direction.
          </p>
        </div>

        {/* 3 Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {HYPOTHESES.map((hypo) => {
            const isSelected = selectedHypothesis === hypo.id;
            return (
              <button
                key={hypo.id}
                onClick={() => setSelectedHypothesis(hypo.id)}
                className={`text-left p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? hypo.id === 'routing'
                      ? 'bg-blue-50/70 border-[#316BEA] shadow-md ring-2 ring-[#316BEA]/20'
                      : hypo.id === 'trust'
                      ? 'bg-amber-50/70 border-[#C27A14] shadow-md ring-2 ring-[#C27A14]/20'
                      : 'bg-slate-100 border-slate-400 shadow-md'
                    : 'bg-white border-[#DCE4EE] hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      hypo.tagColor === 'blue'
                        ? 'bg-[#316BEA] text-white'
                        : hypo.tagColor === 'amber'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {hypo.tag}
                    </span>
                    {isSelected && (
                      <span className="text-xs font-semibold text-[#316BEA] flex items-center gap-1">
                        Active Card
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    {hypo.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-600 mt-1">
                    "{hypo.subtitle}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70 text-[11px] text-[#316BEA] font-semibold flex items-center gap-1">
                  <span>Explore hypothesis logic</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Hypothesis Deep Dive Inspector */}
        <div className="bg-white border border-[#DCE4EE] rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Hypothesis Rigor Deep Dive</span>
              <h4 className="text-xl font-bold text-slate-900 font-display">
                {active.name} — <span className="text-slate-500 font-normal text-base">{active.subtitle}</span>
              </h4>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              active.tagColor === 'blue' ? 'bg-blue-100 text-[#316BEA]' : active.tagColor === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
            }`}>
              {active.tag}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            
            {/* Why We Believe */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider font-mono">
                <Bookmark className="w-3.5 h-3.5 text-[#316BEA]" />
                <span>Why We Believe It</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {active.whyWeBelieve}
              </p>
            </div>

            {/* What Would Prove */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#159A68]" />
                <span>What Would Prove It (PASS Condition)</span>
              </div>
              <p className="text-emerald-950 leading-relaxed">
                {active.whatWouldProve}
              </p>
            </div>

            {/* What Would Disprove */}
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider font-mono">
                <XCircle className="w-3.5 h-3.5 text-[#BD3B34]" />
                <span>What Would Disprove It (FAIL Condition)</span>
              </div>
              <p className="text-rose-950 leading-relaxed">
                {active.whatWouldDisprove}
              </p>
            </div>

            {/* Product Implication */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-[#C6DCFD] space-y-2">
              <div className="flex items-center gap-2 text-[#0B1F3A] font-bold text-xs uppercase tracking-wider font-mono">
                <Zap className="w-3.5 h-3.5 text-[#316BEA]" />
                <span>Product Decision & Action</span>
              </div>
              <p className="text-slate-800 leading-relaxed">
                {active.productImplication}
              </p>
            </div>

          </div>
        </div>

        {/* Behavioral Archetype Matrix */}
        <div className="bg-white border border-[#DCE4EE] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 sm:p-5 bg-[#0B1728] text-white flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#316BEA]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Behavioral Archetypes (Patterns vs Hypotheses)</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Consented 1st-Party Telemetry</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] text-slate-500 uppercase">
                <tr>
                  <th className="p-3.5 sm:px-4">Archetype</th>
                  <th className="p-3.5 sm:px-4">Observed Telemetry</th>
                  <th className="p-3.5 sm:px-4">Hypothesis</th>
                  <th className="p-3.5 sm:px-4">Product Response</th>
                  <th className="p-3.5 sm:px-4">Evidence Needed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="bg-blue-50/30 font-medium">
                  <td className="p-3.5 sm:px-4 font-bold text-[#316BEA]">
                    High-Frequency Leakage (Target)
                  </td>
                  <td className="p-3.5 sm:px-4">
                    Repeat tracked orders; recent activity; concentrated retailer/category behavior.
                  </td>
                  <td className="p-3.5 sm:px-4 text-slate-900 font-semibold">
                    CashKaro is valued but not routed at moment of retailer intent.
                  </td>
                  <td className="p-3.5 sm:px-4">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                      Validate Intent Router
                    </span>
                  </td>
                  <td className="p-3.5 sm:px-4 text-slate-600">
                    Late recall/restart effort + incremental response.
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:px-4 font-semibold text-slate-900">
                    Declining Users
                  </td>
                  <td className="p-3.5 sm:px-4">
                    Prior activity drops sharply; documented tracking/payout/support ticket events.
                  </td>
                  <td className="p-3.5 sm:px-4">
                    Trust or perceived value decayed after a negative tracking or claim failure.
                  </td>
                  <td className="p-3.5 sm:px-4">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                      Trust Discovery + Matched Analysis
                    </span>
                  </td>
                  <td className="p-3.5 sm:px-4 text-slate-600">
                    Compare users with/without documented failure events.
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:px-4 font-semibold text-slate-900">
                    Low-Adoption Users
                  </td>
                  <td className="p-3.5 sm:px-4">
                    Persistently low use regardless of recency; single bonus redemption.
                  </td>
                  <td className="p-3.5 sm:px-4">
                    A CashKaro shopping habit or value perception was never established.
                  </td>
                  <td className="p-3.5 sm:px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                      Discovery / Value Research
                    </span>
                  </td>
                  <td className="p-3.5 sm:px-4 text-slate-600">
                    Starting-surface and value-understanding interviews.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-[#316BEA] shrink-0 mt-0.5" />
            <div>
              <strong>Target ≠ Experiment Population:</strong> Target segment = validated high-frequency leakage users. Experiment-eligible population = Target segment + Desktop/Chrome reach + Consent + Eligible retailer + Measurement eligibility.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
