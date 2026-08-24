import React, { useState } from 'react';
import { ACCEPTANCE_CRITERIA } from '../data/caseData';
import { ReadingDepth } from '../types';
import { 
  FileCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Terminal, 
  Layers, 
  Sparkles, 
  Lock, 
  Cpu,
  ArrowRight
} from 'lucide-react';

interface ProductSpecSectionProps {
  readingDepth: ReadingDepth;
}

export const ProductSpecSection: React.FC<ProductSpecSectionProps> = ({ readingDepth }) => {
  const [activeTab, setActiveTab] = useState<'ac' | 'journey' | 'non-functional' | 'story'>('ac');
  const [checkedAcs, setCheckedAcs] = useState<Record<string, boolean>>({
    AC1: true,
    AC2: true,
    AC3: true,
    AC4: true,
    AC5: true,
    AC6: true,
    AC7: true,
  });

  const toggleAc = (id: string) => {
    setCheckedAcs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const steps = [
    {
      step: '1. Detect',
      userExp: 'User visits a supported retailer domain. No prompt at checkout or after suppression.',
      systemBehavior: 'Signed, versioned retailer configuration; local domain match only.',
    },
    {
      step: '2. Qualify',
      userExp: 'Prompt shown ONLY if user is treated, logged in/consented, and eligible.',
      systemBehavior: 'Experiment assignment, opaque segment eligibility, frequency cap, and policy returned server-side.',
    },
    {
      step: '3. Explain',
      userExp: '"Cashback available at [retailer]. Activate CashKaro." Rate, terms, and expectation shown.',
      systemBehavior: 'Stale configuration (>24h) fails closed.',
    },
    {
      step: '4. Activate',
      userExp: 'One explicit action opens the tracked path and returns to a supported destination.',
      systemBehavior: 'Server-side Click ID created; existing referral/attribution blocks activation.',
    },
    {
      step: '5. Confirm',
      userExp: 'User sees activation and later a tracking-status expectation in wallet.',
      systemBehavior: 'Partner/network postback reconciles Click ID; unreconciled orders enter timeout bucket.',
    },
  ];

  return (
    <section id="product-spec" className="py-12 sm:py-16 border-b border-[#DCE4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#316BEA] tracking-wider mb-2">
            <span>08</span>
            <span>/</span>
            <span>Engineering Readiness</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-[#0B1F3A] tracking-tight">
            Product specification & acceptance criteria.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            The PRD translates user needs into explicit engineering contracts. Every acceptance criterion is testable, auditable, and designed with <strong>fail-closed security</strong>.
          </p>
        </div>

        {/* Tabbed Interactive Spec Container */}
        <div className="bg-white border border-[#DCE4EE] rounded-2xl overflow-hidden shadow-sm">
          
          {/* Top Spec Navigation Bar */}
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('ac')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'ac' ? 'bg-[#316BEA] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Acceptance Criteria (AC1–AC7)
              </button>
              <button
                onClick={() => setActiveTab('journey')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'journey' ? 'bg-[#316BEA] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                5-Step Experience Contract
              </button>
              <button
                onClick={() => setActiveTab('non-functional')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'non-functional' ? 'bg-[#316BEA] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Fail-Closed Security & Privacy
              </button>
              <button
                onClick={() => setActiveTab('story')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'story' ? 'bg-[#316BEA] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                User Story & Preconditions
              </button>
            </div>
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              V1 Engineering Spec
            </span>
          </div>

          {/* Tab 1: Acceptance Criteria Checklist */}
          {activeTab === 'ac' && (
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-base text-slate-900">
                  Pre-Launch Verification Checklist (AC1–AC7)
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {Object.values(checkedAcs).filter(Boolean).length}/7 Verified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ACCEPTANCE_CRITERIA.map((ac) => {
                  const isChecked = checkedAcs[ac.id];
                  return (
                    <div
                      key={ac.id}
                      onClick={() => toggleAc(ac.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isChecked
                          ? 'bg-blue-50/50 border-blue-200 shadow-xs'
                          : 'bg-slate-50/60 border-slate-200 opacity-70'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        isChecked ? 'bg-[#316BEA] text-white' : 'bg-slate-300 text-slate-600'
                      }`}>
                        {isChecked ? <CheckCircle2 className="w-3.5 h-3.5" /> : ac.id.slice(-1)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#316BEA]">{ac.id}</span>
                          <span className="font-bold text-xs text-slate-900">{ac.title}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                            {ac.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {ac.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: 5-Step Experience Table */}
          {activeTab === 'journey' && (
            <div className="p-6 sm:p-8">
              <h3 className="font-display font-bold text-base text-slate-900 mb-4">
                5-Step Intent Router Interaction & System Contract
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {steps.map((s, idx) => (
                  <div key={idx} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 bg-white hover:bg-slate-50/80">
                    <div className="md:col-span-2 font-mono font-bold text-[#316BEA]">
                      {s.step}
                    </div>
                    <div className="md:col-span-5 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                        User Facing Experience:
                      </span>
                      <p className="text-slate-800 font-medium">{s.userExp}</p>
                    </div>
                    <div className="md:col-span-5 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                        System Constraint & Action:
                      </span>
                      <p className="text-slate-600">{s.systemBehavior}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Fail-Closed Security & Privacy */}
          {activeTab === 'non-functional' && (
            <div className="p-6 sm:p-8 space-y-4 text-xs sm:text-sm">
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">
                Non-Functional Security, Rollback, and Privacy Standards
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-mono font-bold text-slate-900 uppercase flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#316BEA]" />
                    <span>Attribution Safety & Precedence</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Existing referral detected? <strong>YES → Do not activate router; preserve attribution.</strong> The router must never overwrite another legitimate creator or network attribution tag.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-mono font-bold text-slate-900 uppercase flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#316BEA]" />
                    <span>Real-Time Configuration Rollback</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    All retailer rules, rates, and extension prompts are fetched dynamically with a 24h hard staleness ceiling. Any partner can be killed in &lt;60s via server configuration without extension app store updates.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-mono font-bold text-slate-900 uppercase flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#159A68]" />
                    <span>Privacy by Architecture</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    V1 relies on explicit user consent and local domain matching. The extension never inspects DOM text, does not monitor cross-app activity, and passes zero raw purchase history to the client.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-mono font-bold text-slate-900 uppercase flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#316BEA]" />
                    <span>Postback Reconciliation Timeout</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Unreconciled Click IDs enter a formal holding timeout bucket. They are excluded from the primary ITT outcome calculation until network postback maturity is achieved.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: User Story & Preconditions */}
          {activeTab === 'story' && (
            <div className="p-6 sm:p-8 space-y-5 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 space-y-2">
                <span className="font-mono text-[10px] font-bold uppercase text-[#316BEA] block">
                  Core User Story
                </span>
                <p className="text-slate-900 font-medium leading-relaxed">
                  "As a consented existing CashKaro user shopping on an eligible partner retailer, I want to activate cashback without restarting my shopping journey so I can earn cashback without disrupting my cart or purchase progress."
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-mono text-[10px] font-bold uppercase text-slate-500 block">
                  Required Preconditions for Prompt Execution
                </span>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                  <li>User is authenticated and in the pre-registered treatment cohort.</li>
                  <li>Current URL domain matches the active signed retailer allowlist.</li>
                  <li>No existing affiliate or creator tracking parameter exists in URL.</li>
                  <li>Page is not a cart modification, login, or checkout surface (AC3).</li>
                  <li>User has not exceeded the hourly/daily frequency prompt cap.</li>
                </ul>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
