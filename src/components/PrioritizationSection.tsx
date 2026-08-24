import React from 'react';
import { PRIORITIZATION_DIRECTIONS } from '../data/caseData';
import { ReadingDepth } from '../types';
import { 
  Check, 
  X, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  SlidersHorizontal,
  Quote
} from 'lucide-react';

interface PrioritizationSectionProps {
  readingDepth: ReadingDepth;
}

export const PrioritizationSection: React.FC<PrioritizationSectionProps> = ({ readingDepth }) => {
  const getBadgeClass = (val: string) => {
    if (val === 'HIGH') return 'bg-emerald-100 text-emerald-800 font-bold';
    if (val === 'MEDIUM' || val === 'MODERATE') return 'bg-amber-100 text-amber-800 font-semibold';
    return 'bg-slate-200 text-slate-700 font-medium';
  };

  return (
    <section id="prioritization" className="py-12 sm:py-16 border-b border-[#DCE4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#316BEA] tracking-wider mb-2">
            <span>04</span>
            <span>/</span>
            <span>Prioritization & Segment Lens</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-[#0B1F3A] tracking-tight">
            Why test high-frequency leakage first?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            I deliberately narrowed candidate directions from five down to one clear causal test. We avoid arbitrary scoring formulas and evaluate candidate initiatives across rigorous <strong>qualitative feasibility and causal reversibility criteria</strong>.
          </p>
        </div>

        {/* Highlighted Senior PM Quote Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1728] text-white border border-slate-800 shadow-md mb-8 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <Quote className="w-8 h-8 text-[#316BEA] shrink-0 opacity-70" />
            <div>
              <p className="text-sm sm:text-base text-slate-100 font-medium italic leading-relaxed">
                "High-frequency leakage is selected because it offers the cleanest reversible learning loop, not because it is assumed to be the largest opportunity."
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="text-[#159A68] font-bold">CORE STRATEGY PRINCIPLE</span>
                <span>•</span>
                <span>Earn the right to build the smallest reversible mechanism first</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prioritization Comparison Matrix */}
        <div className="bg-white border border-[#DCE4EE] rounded-2xl overflow-hidden shadow-sm mb-8">
          <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#316BEA] font-semibold">Strategic Decision Matrix</span>
              <h3 className="text-base font-bold text-white">4 Candidate Directions Evaluated</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Ranked by Causal Confidence & Reversibility</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] text-slate-500 uppercase">
                <tr>
                  <th className="p-3.5 sm:px-4">Direction</th>
                  <th className="p-3.5 sm:px-4">Primary Moment</th>
                  <th className="p-3.5 sm:px-4 text-center">User Value</th>
                  <th className="p-3.5 sm:px-4 text-center">Causality</th>
                  <th className="p-3.5 sm:px-4 text-center">Addressability</th>
                  <th className="p-3.5 sm:px-4 text-center">Speed</th>
                  <th className="p-3.5 sm:px-4 text-center">Reversibility</th>
                  <th className="p-3.5 sm:px-4">V1 Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {PRIORITIZATION_DIRECTIONS.map((dir, idx) => {
                  const isSelected = dir.status.includes('SELECTED');
                  return (
                    <tr 
                      key={dir.name}
                      className={isSelected ? 'bg-blue-50/60 font-medium' : 'hover:bg-slate-50/70'}
                    >
                      <td className="p-3.5 sm:px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          {isSelected && <span className="w-2 h-2 rounded-full bg-[#316BEA]"></span>}
                          <span className={isSelected ? 'text-[#316BEA]' : ''}>{dir.name}</span>
                        </div>
                      </td>
                      <td className="p-3.5 sm:px-4 text-slate-600">{dir.primaryMoment}</td>
                      <td className="p-3.5 sm:px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${getBadgeClass(dir.userValue)}`}>
                          {dir.userValue}
                        </span>
                      </td>
                      <td className="p-3.5 sm:px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${getBadgeClass(dir.causality)}`}>
                          {dir.causality}
                        </span>
                      </td>
                      <td className="p-3.5 sm:px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${getBadgeClass(dir.addressability)}`}>
                          {dir.addressability}
                        </span>
                      </td>
                      <td className="p-3.5 sm:px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${getBadgeClass(dir.speed)}`}>
                          {dir.speed}
                        </span>
                      </td>
                      <td className="p-3.5 sm:px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${getBadgeClass(dir.reversibility)}`}>
                          {dir.reversibility}
                        </span>
                      </td>
                      <td className="p-3.5 sm:px-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${
                          isSelected
                            ? 'bg-[#316BEA] text-white shadow-xs'
                            : dir.status.includes('GUARDRAIL')
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : dir.status.includes('DO NOT')
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {dir.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong className="text-slate-800">Why Collapse the Others?</strong> A home-screen lock widget and share/deep-link recovery were collapsed because they either risk generic-reminder spam or depend on unproven cross-app operating system hooks.
              </div>
              <div>
                <strong className="text-slate-800">Causal Clarity:</strong> The Intent Router allows a persistent 50/50 Intention-To-Treat holdout to isolate true incrementality from natural channel cannibalization.
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
