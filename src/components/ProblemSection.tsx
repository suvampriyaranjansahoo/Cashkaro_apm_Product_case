import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ArrowRight, 
  CornerDownRight, 
  RotateCcw, 
  Search, 
  ShoppingCart, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { ReadingDepth } from '../types';
import { SectionHeader } from './SectionHeader';

interface ProblemSectionProps {
  readingDepth: ReadingDepth;
  isHighlighted?: boolean;
  onToggleHighlight?: (id: string) => void;
}

export const ProblemSection: React.FC<ProblemSectionProps> = ({ 
  readingDepth,
  isHighlighted,
  onToggleHighlight 
}) => {
  const [activeMoment, setActiveMoment] = useState<number>(1);

  const moments = [
    {
      id: 'never-considered',
      title: 'CashKaro is never considered',
      candidateCause: 'Default retailer habit; weak discovery or perceived low value in standard routine purchases.',
      evidenceNeeded: 'Recent-purchase reconstruction; direct navigation log vs CashKaro intent entry.',
      isTarget: false,
      tag: 'Broad Habit Problem',
      tagColor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    },
    {
      id: 'late-recall',
      title: 'User knows CashKaro but continues',
      candidateCause: 'SELECTED TESTABLE MECHANISM: Late recall after landing on retailer; high cognitive restart friction; eligibility uncertainty; fear of cart loss.',
      evidenceNeeded: 'Moment-of-recall timeline in purchase reconstruction; stated reasons for not switching apps/tabs; supported retailer mix.',
      isTarget: true,
      tag: 'SELECTED V1 MECHANISM',
      tagColor: 'bg-[#316BEA] text-white',
    },
    {
      id: 'prior-failure',
      title: 'User stopped after prior use',
      candidateCause: 'Negative tracking or delayed payout experience; perceived broken contract leading to intentional churn.',
      evidenceNeeded: 'Matched event study: compare users with documented tracking dispute tickets against matched users without disputes.',
      isTarget: false,
      tag: 'Trust Guardrail / Future Bet',
      tagColor: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300',
    },
    {
      id: 'technical-failure',
      title: 'Activation occurred but no tracked order',
      candidateCause: 'Attribution overwrite, category eligibility exclusion, ad-blocker drop, or asynchronous affiliate network postback timeout.',
      evidenceNeeded: 'Postback reconciliation logs, affiliate network click ID audits, and retailer-level drop-off telemetry.',
      isTarget: false,
      tag: 'Technical Reliability',
      tagColor: 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300',
    },
  ];

  return (
    <section 
      id="problem" 
      className={`py-12 sm:py-16 border-b border-[#DCE4EE] dark:border-slate-800 transition-colors ${
        isHighlighted ? 'section-highlighted' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Copy Link & Highlight */}
        <SectionHeader
          num="02"
          category="Problem Framing"
          sectionId="problem"
          isHighlighted={isHighlighted}
          onToggleHighlight={onToggleHighlight}
          title={<span>"Existing-user leakage is an outcome, not a diagnosis."</span>}
          description={
            <span>
              A generic reminder or push notification could lift vanity clicks while merely shifting a purchase CashKaro would already capture. Product rigor requires identifying the <strong>exact point of behavioral failure</strong> in a non-linear journey.
            </span>
          }
        />

        {/* Non-Linear Journey Interactive Visualization */}
        <div className="bg-white dark:bg-[#0E1726] border border-[#DCE4EE] dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Behavioral Model</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">The Non-Linear Shopping Journey & Leakage Points</h3>
            </div>
            <div className="text-xs bg-blue-50 dark:bg-blue-950/50 text-[#316BEA] dark:text-blue-300 px-2.5 py-1 rounded-md font-medium border border-blue-100 dark:border-blue-800/50">
              Interactive Flow: Click moments below to inspect failure modes
            </div>
          </div>

          {/* Journey Path Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative">
            
            {/* Step 1 */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>01. Need</span>
                <Search className="w-3.5 h-3.5" />
              </div>
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">Need / Discovery</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">User searches for product or opens preferred shopping app.</div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                <XCircle className="w-3 h-3 shrink-0" />
                <span>Leakage: Direct retailer entry</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>02. Compare</span>
                <RotateCcw className="w-3.5 h-3.5" />
              </div>
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">Compare Retailers</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Cross-browsing tabs, checking coupon blogs & bank offers.</div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
                <CornerDownRight className="w-3 h-3 shrink-0" />
                <span>Shift: Tab jumps & distraction</span>
              </div>
            </div>

            {/* Step 3 (TARGET STEP) */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border-2 border-[#316BEA] dark:border-blue-500 shadow-xs space-y-2 relative">
              <div className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-[#316BEA] text-white text-[9px] font-mono font-bold uppercase tracking-wider shadow-xs">
                Targeted Moment
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#316BEA] dark:text-blue-300">
                <span>03. Cart Intent</span>
                <ShoppingCart className="w-3.5 h-3.5" />
              </div>
              <div className="font-bold text-xs text-[#0B1F3A] dark:text-white">Retailer / Cart</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300">Product found; cart populated on retailer site.</div>
              <div className="pt-2 border-t border-blue-200 dark:border-blue-900/60 text-[10px] text-[#316BEA] dark:text-blue-300 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                <span>Late recall + Restart friction</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>04. Checkout</span>
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">Purchase Execution</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Payment completed; merchant order ID generated.</div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                <XCircle className="w-3 h-3 shrink-0" />
                <span>Leakage: Tracking drop / ad-block</span>
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>05. Confidence</span>
                <RotateCcw className="w-3.5 h-3.5" />
              </div>
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">Cashback Confidence</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Postback received & confirmed in user wallet.</div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
                <XCircle className="w-3 h-3 shrink-0" />
                <span>Trust drop → Future bypass</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Competing Leakage Moments Interactive Diagnostic Matrix */}
        <div className="bg-white dark:bg-[#0E1726] border border-[#DCE4EE] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 sm:p-5 bg-slate-900 dark:bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#316BEA] font-semibold">Diagnostic Table</span>
              <h3 className="text-base font-bold text-white">4 Leakage Moments vs Candidate Root Causes & Evidence Required</h3>
            </div>
            <span className="text-xs text-slate-400">Click any row to inspect research protocols</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {moments.map((item, index) => {
              const isSelected = activeMoment === index;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveMoment(index)}
                  className={`p-4 sm:p-5 cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-blue-50/50 dark:bg-blue-950/30' 
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        isSelected ? 'bg-[#316BEA] text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {index + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    </div>
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider self-start sm:self-auto ${item.tagColor}`}>
                      {item.tag}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs mt-3">
                    <div className="md:col-span-6 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Candidate Root Cause:</span>
                      <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{item.candidateCause}</p>
                    </div>
                    <div className="md:col-span-6 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Evidence Needed Before Build:</span>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.evidenceNeeded}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
