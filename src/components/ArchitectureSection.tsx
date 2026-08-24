import React, { useState } from 'react';
import { ReadingDepth } from '../types';
import { 
  ArrowRight, 
  Database, 
  Server, 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  Cpu, 
  GitCommit, 
  Activity, 
  Key, 
  CheckCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { SectionHeader } from './SectionHeader';

interface ArchitectureSectionProps {
  readingDepth: ReadingDepth;
  isHighlighted?: boolean;
  onToggleHighlight?: (id: string) => void;
}

export const ArchitectureSection: React.FC<ArchitectureSectionProps> = ({ 
  readingDepth,
  isHighlighted,
  onToggleHighlight
}) => {
  const [selectedFlow, setSelectedFlow] = useState<'user' | 'decision' | 'data'>('user');
  const [activeNode, setActiveNode] = useState<string | null>('user-3');

  const userFlowNodes = [
    { id: 'user-1', title: '1. User Visits Retailer', desc: 'Navigates to partner site (e.g. Amazon, Myntra) on desktop Chrome.', role: 'Client Browser' },
    { id: 'user-2', title: '2. Extension Matches Domain', desc: 'Local signed allowlist check; zero DOM scraping or keyboard inspection.', role: 'Client Extension' },
    { id: 'user-3', title: '3. Prompt Displayed', desc: 'Single value proposition with dynamic rate and explicit activate button.', role: 'In-Page Overlay' },
    { id: 'user-4', title: '4. User Activates', desc: 'Explicit click initiates tracking handoff without disrupting shopping intent.', role: 'User Action' },
    { id: 'user-5', title: '5. Tracked Journey Hand-off', desc: 'Seamless background session binding with unique cryptographic Click ID.', role: 'Affiliate Gateway' },
    { id: 'user-6', title: '6. Tracking Expected', desc: 'User continues shopping; status communicated cleanly in extension popup.', role: 'Feedback State' },
  ];

  const decisionFlowNodes = [
    { id: 'dec-1', title: '1. Consent & Token Auth', desc: 'Client provides opaque session token; verify user opt-in consent.', role: 'Auth Service' },
    { id: 'dec-2', title: '2. 50/50 ITT Holdout', desc: 'Persistent hash-based randomization. Cohort frozen prior to test.', role: 'Experiment API' },
    { id: 'dec-3', title: '3. Segment Eligibility', desc: 'High-frequency leakage segment validation verified server-side.', role: 'Eligibility Engine' },
    { id: 'dec-4', title: '4. Policy Evaluation', desc: 'Check suppression rules: no checkout pages, frequency caps, no existing referrals.', role: 'Policy Engine' },
    { id: 'dec-5', title: '5. Signed Response', desc: 'Returns cryptographic SHOW or SUPPRESS directive with fresh rates.', role: 'Config Service' },
  ];

  const dataFlowNodes = [
    { id: 'data-1', title: '1. Activation Click', desc: 'User clicks activate; client requests authenticated session link.', role: 'Extension Client' },
    { id: 'data-2', title: '2. Server Click ID Minting', desc: 'Generates opaque, non-guessable UUID Click ID tied to experiment ID.', role: 'Tracking Core' },
    { id: 'data-3', title: '3. Affiliate Redirect', desc: 'Redirects via network affiliate tracking URL with Click ID query parameter.', role: 'Affiliate Router' },
    { id: 'data-4', title: '4. Async Postback Webhook', desc: 'Partner merchant fires server-to-server webhook upon order creation.', role: 'Partner Network' },
    { id: 'data-5', title: '5. Reconciliation & ITT Attribution', desc: 'Reconciles Click ID, assigns order value, and contributes to 50/50 ITT analysis.', role: 'Analytics Engine' },
  ];

  return (
    <section 
      id="architecture" 
      className={`py-12 sm:py-16 border-b border-[#DCE4EE] dark:border-slate-800 transition-colors ${
        isHighlighted ? 'section-highlighted' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Copy Link & Highlight */}
        <SectionHeader
          num="09"
          category="System Design"
          sectionId="architecture"
          isHighlighted={isHighlighted}
          onToggleHighlight={onToggleHighlight}
          title={<span>Decoupled technical architecture & data flows.</span>}
          description={
            <span>
              The system architecture enforces a clean separation of concerns between client rendering, server-side policy evaluation, and asynchronous affiliate reconciliation.
            </span>
          }
        />

        {/* Interactive Architecture Workspace */}
        <div className="bg-[#F0EAD5] dark:bg-slate-950 text-slate-900 dark:text-white border border-[#DEB6C5]/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm mb-8 transition-colors">
          
          {/* Stream Selector Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DEB6C5]/60 dark:border-slate-800 pb-5 mb-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedFlow('user')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedFlow === 'user'
                    ? 'bg-[#D190AC] dark:bg-[#0080AB] text-white shadow-xs'
                    : 'bg-[#F7F6ED] dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-[#DEB6C5]/40 dark:border-transparent'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>1. User Interaction Flow</span>
              </button>
              <button
                onClick={() => setSelectedFlow('decision')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedFlow === 'decision'
                    ? 'bg-[#D190AC] dark:bg-[#0080AB] text-white shadow-xs'
                    : 'bg-[#F7F6ED] dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-[#DEB6C5]/40 dark:border-transparent'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>2. Server Decision Flow</span>
              </button>
              <button
                onClick={() => setSelectedFlow('data')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedFlow === 'data'
                    ? 'bg-[#D190AC] dark:bg-[#0080AB] text-white shadow-xs'
                    : 'bg-[#F7F6ED] dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-[#DEB6C5]/40 dark:border-transparent'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>3. Data & Postback Flow</span>
              </button>
            </div>
            
            <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-[#159A68]" />
              <span>Target Latency: &lt;120ms</span>
            </div>
          </div>

          {/* Animated Box-and-Arrow Node Grid */}
          <div className="space-y-4 mb-8">
            <div className="text-xs font-mono text-[#8F3760] dark:text-[#25C3FF] font-bold uppercase tracking-wider">
              {selectedFlow === 'user' && 'User & Browser In-Page Flow Sequence:'}
              {selectedFlow === 'decision' && 'Server-Side Policy & Experiment Decision Pipeline:'}
              {selectedFlow === 'data' && 'Cryptographic Click ID & Async Affiliate Reconciliation:'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              {(selectedFlow === 'user' ? userFlowNodes : selectedFlow === 'decision' ? decisionFlowNodes : dataFlowNodes).map((node, index) => {
                const isSelected = activeNode === node.id;
                return (
                  <div key={node.id} className="relative group">
                    <button
                      onClick={() => setActiveNode(node.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all h-full flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-white dark:bg-[#0080AB] border-[#D190AC] dark:border-blue-400 text-slate-900 dark:text-white shadow-md ring-2 ring-[#D190AC]/30 dark:ring-[#25C3FF]/40'
                          : 'bg-[#F7F6ED]/90 dark:bg-slate-900 border-[#DEB6C5]/50 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800/80 hover:border-[#DEB6C5]'
                      }`}
                    >
                      <div>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider block mb-1 ${
                          isSelected ? 'text-[#8F3760] dark:text-blue-100 font-extrabold' : 'text-[#D190AC] dark:text-[#25C3FF]'
                        }`}>
                          {node.role}
                        </span>
                        <h4 className="text-xs font-bold leading-tight text-slate-900 dark:text-white mb-2">
                          {node.title}
                        </h4>
                        <p className={`text-[11px] leading-relaxed line-clamp-3 ${
                          isSelected ? 'text-slate-700 dark:text-blue-50' : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {node.desc}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#DEB6C5]/30 dark:border-white/10 text-[9px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
                        <span>Node {index + 1}</span>
                        {isSelected && <span className="text-[#8F3760] dark:text-white font-bold">Selected</span>}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Node Detail Card */}
          {activeNode && (
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-[#DEB6C5]/70 dark:border-slate-700/80 text-xs">
              <div className="flex items-center justify-between mb-1 text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                <span>ARCHITECTURE NODE SPECIFICATION</span>
                <span className="text-[#8F3760] dark:text-[#25C3FF] font-bold">Fail-Closed Guarantee</span>
              </div>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                Every node in the sequence reports structured observability logs (<code className="text-[#8F3760] dark:text-blue-300 font-mono">click_id, config_version, experiment_assigned</code>). If any downstream service fails or latency exceeds 200ms, the extension fails silently without degrading the retailer's native browsing speed.
              </p>
            </div>
          )}
        </div>

        {/* 4 Cross-Functional Architecture Safeguards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white dark:bg-[#0E1726] border border-[#DEB6C5]/70 dark:border-slate-800 shadow-xs space-y-1.5">
            <span className="font-mono text-[10px] font-bold uppercase text-[#8F3760] dark:text-blue-400 block">1. Attribution Safety</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Existing creator/network referral detected? <strong>YES → Suppress router.</strong> Router never overwrites active third-party commissions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#0E1726] border border-[#DEB6C5]/70 dark:border-slate-800 shadow-xs space-y-1.5">
            <span className="font-mono text-[10px] font-bold uppercase text-[#8F3760] dark:text-blue-400 block">2. Reconciliation Timeout</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Unreconciled Click IDs enter a holding maturity bucket and are excluded from primary ITT outcome until finalized.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#0E1726] border border-[#DEB6C5]/70 dark:border-slate-800 shadow-xs space-y-1.5">
            <span className="font-mono text-[10px] font-bold uppercase text-[#8F3760] dark:text-blue-400 block">3. Config Rollback</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Partner-specific allowlists can be instantly disabled server-side without requiring Chrome Web Store releases.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#0E1726] border border-[#DEB6C5]/70 dark:border-slate-800 shadow-xs space-y-1.5">
            <span className="font-mono text-[10px] font-bold uppercase text-[#8F3760] dark:text-blue-400 block">4. Opaque Security</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The client receives only an opaque boolean eligibility token. No raw purchase history or personal data is passed to the extension.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

