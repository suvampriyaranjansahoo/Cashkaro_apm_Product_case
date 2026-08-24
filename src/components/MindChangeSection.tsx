import React, { useState } from 'react';
import { MIND_CHANGE_SCENARIOS } from '../data/caseData';
import { ReadingDepth } from '../types';
import { 
  AlertOctagon, 
  ArrowRight, 
  Compass, 
  RotateCcw, 
  ShieldAlert, 
  Sparkles, 
  XOctagon,
  HelpCircle
} from 'lucide-react';
import { SectionHeader } from './SectionHeader';

interface MindChangeSectionProps {
  readingDepth: ReadingDepth;
  isHighlighted?: boolean;
  onToggleHighlight?: (id: string) => void;
}

export const MindChangeSection: React.FC<MindChangeSectionProps> = ({ 
  readingDepth,
  isHighlighted,
  onToggleHighlight
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('no-routing');

  const selectedScenario = 
    MIND_CHANGE_SCENARIOS.find((s) => s.id === selectedScenarioId) || MIND_CHANGE_SCENARIOS[0];

  return (
    <section 
      id="mind-change" 
      className={`py-12 sm:py-16 bg-[#F7F6ED] dark:bg-slate-950 text-slate-900 dark:text-white border-b border-[#DEB6C5]/70 dark:border-slate-800 transition-colors ${
        isHighlighted ? 'section-highlighted' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Copy Link & Highlight */}
        <SectionHeader
          num="06"
          category="Senior PM Rigor & Falsifiability"
          sectionId="mind-change"
          isHighlighted={isHighlighted}
          onToggleHighlight={onToggleHighlight}
          title={<span>WHAT WOULD CHANGE MY MIND?</span>}
          description={
            <span>
              A hypothesis is only as good as its falsifiability. True product leadership means defining the exact triggers that will cause us to <strong>pivot or kill the initiative</strong> rather than optimizing a bad premise forever.
            </span>
          }
        />

        {/* 6 Clickable Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-8">
          {MIND_CHANGE_SCENARIOS.map((scenario) => {
            const isSelected = selectedScenarioId === scenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenarioId(scenario.id)}
                className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#D190AC] to-[#DEB6C5] dark:from-[#0080AB] dark:to-[#00AFD3] text-white border-transparent shadow-md'
                    : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-[#DEB6C5]/50 dark:border-slate-800 hover:bg-[#F0EAD5] dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div>
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider block mb-1 ${
                    isSelected ? 'text-white/90' : 'text-[#8F3760] dark:text-slate-400'
                  }`}>
                    {scenario.category}
                  </span>
                  <div className="font-mono text-xs font-bold leading-snug">
                    {scenario.title}
                  </div>
                </div>
                <div className={`text-[10px] mt-3 font-semibold flex items-center gap-1 ${
                  isSelected ? 'text-white' : 'text-[#D190AC] dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-300'
                }`}>
                  <span>Inspect</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Scenario Consequence Card */}
        <div className="bg-white dark:bg-slate-900 border border-[#DEB6C5]/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md dark:shadow-2xl relative overflow-hidden transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0D6DE] dark:border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center font-mono text-xs font-bold">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#8F3760] dark:text-slate-400 font-bold">
                  Falsification Scenario Trigger
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  {selectedScenario.title}
                </h3>
              </div>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#F0EAD5] dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-[#DEB6C5]/50 dark:border-slate-700">
              Domain: {selectedScenario.category}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
            
            {/* The Trigger */}
            <div className="p-4 rounded-xl bg-[#F7F6ED] dark:bg-slate-950/70 border border-[#DEB6C5]/50 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold block">
                1. Observable Evidence Trigger
              </span>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {selectedScenario.trigger}
              </p>
            </div>

            {/* The Consequence */}
            <div className="p-4 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 space-y-2">
              <span className="text-[10px] font-mono uppercase text-rose-700 dark:text-rose-400 font-bold block flex items-center gap-1">
                <XOctagon className="w-3 h-3" />
                <span>2. Strategic Consequence</span>
              </span>
              <p className="text-rose-950 dark:text-rose-100 leading-relaxed font-medium">
                {selectedScenario.consequence}
              </p>
            </div>

            {/* The Zero-Dogma Pivot Action */}
            <div className="p-4 rounded-xl bg-[#F0D6DE]/50 dark:bg-blue-950/40 border border-[#DEB6C5] dark:border-blue-800/50 space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#8F3760] dark:text-blue-300 font-bold block flex items-center gap-1">
                <RotateCcw className="w-3 h-3" />
                <span>3. Zero-Dogma Pivot Action</span>
              </span>
              <p className="text-slate-900 dark:text-blue-100 leading-relaxed font-medium">
                {selectedScenario.pivotAction}
              </p>
            </div>

          </div>

          {/* Quote footer */}
          <div className="mt-6 pt-4 border-t border-[#F0D6DE] dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 italic">
            "If wrong, do not optimize the router indefinitely — redirect discovery immediately to the mechanism the evidence supports."
          </div>
        </div>

      </div>
    </section>
  );
};

