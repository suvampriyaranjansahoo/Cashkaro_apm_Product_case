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
import { SectionHeader } from './SectionHeader';

interface PrioritizationSectionProps {
  readingDepth: ReadingDepth;
  isHighlighted?: boolean;
  onToggleHighlight?: (id: string) => void;
}

export const PrioritizationSection: React.FC<PrioritizationSectionProps> = ({ 
  readingDepth,
  isHighlighted,
  onToggleHighlight
}) => {
  const getBadgeClass = (val: string) => {
    if (val === 'HIGH') return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold';
    if (val === 'MEDIUM' || val === 'MODERATE') return 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-semibold';
    return 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium';
  };

  return (
    <section 
      id="prioritization" 
      className={`py-12 sm:py-16 border-b border-[#DCE4EE] dark:border-slate-800 transition-colors ${
        isHighlighted ? 'section-highlighted' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Copy Link & Highlight */}
        <SectionHeader
          num="04"
          category="Prioritization & Segment Lens"
          sectionId="prioritization"
          isHighlighted={isHighlighted}
          onToggleHighlight={onToggleHighlight}
          title={<span>Why test high-frequency leakage first?</span>}
          description={
            <span>
              I deliberately narrowed candidate directions from five down to one clear causal test. We avoid arbitrary scoring formulas and evaluate candidate initiatives across rigorous <strong>qualitative feasibility and causal reversibility criteria</strong>.
            </span>
          }
        />

        {/* Highlighted Senior PM Quote Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#F0EAD5] via-[#F0D6DE]/60 to-[#F7F6ED] dark:from-[#0B1728] dark:to-slate-950 text-slate-900 dark:text-white border border-[#DEB6C5]/80 dark:border-slate-800 shadow-sm mb-8 relative overflow-hidden transition-colors">
          <div className="flex items-start gap-4">
            <Quote className="w-8 h-8 text-[#D190AC] dark:text-[#25C3FF] shrink-0 opacity-80" />
            <div>
              <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 font-semibold italic leading-relaxed">
                "High-frequency leakage is selected because it offers the cleanest reversible learning loop, not because it is assumed to be the largest opportunity."
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-mono">
                <span className="text-[#8F3760] dark:text-emerald-400 font-bold">CORE STRATEGY PRINCIPLE</span>
                <span>•</span>
                <span>Earn the right to build the smallest reversible mechanism first</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prioritization Comparison Matrix */}
        <div className="bg-white dark:bg-[#0E1726] border border-[#DEB6C5]/70 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm mb-8 transition-colors">
          <div className="p-4 sm:p-5 bg-[#F0EAD5] dark:bg-slate-950 text-slate-900 dark:text-white border-b border-[#DEB6C5]/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F3760] dark:text-[#25C3FF] font-bold">Strategic Decision Matrix</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">4 Candidate Directions Evaluated</h3>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-medium">Ranked by Causal Confidence & Reversibility</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6ED] dark:bg-slate-900/80 border-b border-[#DEB6C5]/40 dark:border-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-400 uppercase">
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
              <tbody className="divide-y divide-[#F0D6DE]/60 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {PRIORITIZATION_DIRECTIONS.map((dir) => {
                  const isSelected = dir.status.includes('SELECTED');
                  return (
                    <tr 
                      key={dir.name}
                      className={isSelected ? 'bg-[#F0D6DE]/35 dark:bg-blue-950/30 font-medium' : 'hover:bg-[#F7F6ED]/70 dark:hover:bg-slate-800/40'}
                    >
                      <td className="p-3.5 sm:px-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          {isSelected && <span className="w-2 h-2 rounded-full bg-[#D190AC] dark:bg-[#25C3FF]"></span>}
                          <span className={isSelected ? 'text-[#8F3760] dark:text-blue-400 font-bold' : ''}>{dir.name}</span>
                        </div>
                      </td>
                      <td className="p-3.5 sm:px-4 text-slate-600 dark:text-slate-300">{dir.primaryMoment}</td>
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
                            ? 'bg-[#D190AC] dark:bg-[#0080AB] text-white shadow-xs'
                            : dir.status.includes('GUARDRAIL')
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                            : dir.status.includes('DO NOT')
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                            : 'bg-[#F0EAD5] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[#DEB6C5]/40 dark:border-slate-700'
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

          <div className="p-4 bg-[#F7F6ED] dark:bg-slate-900/60 border-t border-[#DEB6C5]/40 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-400">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong className="text-slate-900 dark:text-slate-200">Why Collapse the Others?</strong> A home-screen lock widget and share/deep-link recovery were collapsed because they either risk generic-reminder spam or depend on unproven cross-app operating system hooks.
              </div>
              <div>
                <strong className="text-slate-900 dark:text-slate-200">Causal Clarity:</strong> The Intent Router allows a persistent 50/50 Intention-To-Treat holdout to isolate true incrementality from natural channel cannibalization.
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

