import React from 'react';
import { ReadingDepth } from '../types';
import { 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Layers, 
  Workflow, 
  AlertOctagon,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { SectionHeader } from './SectionHeader';

interface OperatingModelSectionProps {
  readingDepth: ReadingDepth;
  isHighlighted?: boolean;
  onToggleHighlight?: (id: string) => void;
}

export const OperatingModelSection: React.FC<OperatingModelSectionProps> = ({ 
  readingDepth,
  isHighlighted,
  onToggleHighlight
}) => {
  const phases = [
    {
      phase: 'Discover',
      owner: 'PM + Research + Analytics',
      deliverable: 'Problem evidence, target definition, cohort/reach analysis, proposed historical trust analysis.',
      exit: 'G1/G2 pass or re-point.',
      step: '01',
    },
    {
      phase: 'De-risk',
      owner: 'PM + Eng + Partnerships + Legal',
      deliverable: 'Technical spike, partner readiness, reconciliation contract, consent, and instrumentation.',
      exit: 'G3 pass.',
      step: '02',
    },
    {
      phase: 'Build / Pilot',
      owner: 'PM + Engineering + Design + QA',
      deliverable: 'V1, instrumentation, support readiness, controlled retailer allowlist.',
      exit: 'Operational launch checklist passed.',
      step: '03',
    },
    {
      phase: 'Experiment',
      owner: 'PM + Analytics',
      deliverable: 'Powered 50/50 ITT readout with postback-matured outcome window.',
      exit: 'G4: Scale / iterate once / kill.',
      step: '04',
    },
    {
      phase: 'Scale',
      owner: 'PM + Partnerships + Eng + Analytics',
      deliverable: 'Controlled retailer expansion and repeatable operating playbook.',
      exit: 'Repeatable lift, economics, and guardrails hold.',
      step: '05',
    },
  ];

  const risks = [
    {
      risk: 'Attribution Overwrite',
      mitigation: 'Fail closed on existing referral; automated audit; immediate per-retailer kill switch.',
      owner: 'Partnerships + Engineering',
      cadence: 'Live during pilot; weekly thereafter',
      severity: 'Critical',
    },
    {
      risk: 'Partner Resistance',
      mitigation: 'Written retailer/network approvals; allowlist; partner-specific off switch; never scale a resisted flow.',
      owner: 'Partnerships',
      cadence: 'Pre-launch, then every retailer expansion',
      severity: 'High',
    },
    {
      risk: 'False Tracking Expectation',
      mitigation: 'Fresh terms sync, "Tracking expected" copy, clear dispute route, postback timeout bucket.',
      owner: 'Support + Product',
      cadence: 'Daily pilot review; weekly experiment review',
      severity: 'High',
    },
    {
      risk: 'Channel Shift Disguised as Lift',
      mitigation: 'Persistent holdout and ITT primary metric; activation treated as diagnostic only.',
      owner: 'Analytics + PM',
      cadence: 'At interim and final readout',
      severity: 'Critical',
    },
    {
      risk: 'Weak Desktop Reach',
      mitigation: 'G2 addressability/power gate; mobile recovery remains user-initiated V1.5.',
      owner: 'PM + Analytics',
      cadence: 'Before cohort randomization',
      severity: 'Medium',
    },
  ];

  return (
    <section 
      id="operating-model" 
      className={`py-12 sm:py-16 border-b border-[#DCE4EE] dark:border-slate-800 transition-colors ${
        isHighlighted ? 'section-highlighted' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Copy Link & Highlight */}
        <SectionHeader
          num="12"
          category="Operating Model & Risk Management"
          sectionId="operating-model"
          isHighlighted={isHighlighted}
          onToggleHighlight={onToggleHighlight}
          title={<span>Execution: cross-functional RACI & risk cadences.</span>}
          description={
            <span>
              Strategy requires operational ownership. We define distinct deliverables for each phase alongside a comprehensive risk matrix with <strong>named owners and recurring review cadences</strong>.
            </span>
          }
        />

        {/* 5-Phase Horizontal Operating Track */}
        <div className="bg-white dark:bg-[#0E1726] border border-[#DCE4EE] dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Phased Execution Pipeline</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Discover → De-Risk → Build/Pilot → Experiment → Scale</h3>
            </div>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Stage Gate Governance</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {phases.map((p) => (
              <div key={p.phase} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>Phase {p.step}</span>
                    <span className="w-2 h-2 rounded-full bg-[#316BEA]"></span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">{p.phase}</h4>
                  
                  <div className="mt-2 text-[11px] space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">Owner:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 block">{p.owner}</span>
                  </div>

                  <div className="mt-2 text-[11px] space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">Deliverable:</span>
                    <p className="text-slate-600 dark:text-slate-400 leading-snug">{p.deliverable}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 text-[10px] font-mono font-bold text-[#159A68]">
                  Exit: {p.exit}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk & Mitigation Matrix with Named Owners */}
        <div className="bg-white dark:bg-[#0E1726] border border-[#DCE4EE] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm mb-8">
          <div className="p-4 sm:p-5 bg-slate-900 dark:bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Risk Management & Accountability Matrix
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Explicit Cadences</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-500 uppercase">
                <tr>
                  <th className="p-3.5 sm:px-4">Risk Category</th>
                  <th className="p-3.5 sm:px-4">Mitigation & Trigger</th>
                  <th className="p-3.5 sm:px-4">Named Owner</th>
                  <th className="p-3.5 sm:px-4">Review Cadence</th>
                  <th className="p-3.5 sm:px-4 text-center">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {risks.map((r) => (
                  <tr key={r.risk} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                    <td className="p-3.5 sm:px-4 font-bold text-slate-900 dark:text-white">
                      {r.risk}
                    </td>
                    <td className="p-3.5 sm:px-4 text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                      {r.mitigation}
                    </td>
                    <td className="p-3.5 sm:px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {r.owner}
                    </td>
                    <td className="p-3.5 sm:px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {r.cadence}
                    </td>
                    <td className="p-3.5 sm:px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        r.severity === 'Critical' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300' : r.severity === 'High' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {r.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Partner Readiness Check Protocol */}
        <div className="p-4 sm:p-5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-900/60 text-xs text-amber-950 dark:text-amber-200">
          <div className="flex items-center gap-2 font-bold mb-1 font-mono uppercase tracking-wider text-amber-900 dark:text-amber-300">
            <CheckCircle2 className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>Partner Readiness Check (Hard Gate Before Retailer Launch)</span>
          </div>
          <p className="leading-relaxed">
            Approved retailer/network terms in writing → eligible pages confirmed → tracking/postback verified → attribution precedence verified → support route defined → partner kill switch tested. <strong>READY → Launch. NOT READY → Exclude Retailer.</strong>
          </p>
        </div>

      </div>
    </section>
  );
};

