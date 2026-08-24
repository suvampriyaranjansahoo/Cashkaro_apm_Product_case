import React, { useState } from 'react';
import { HelpCircle, Info, X } from 'lucide-react';

export interface TermDefinition {
  term: string;
  shortDef: string;
  analystContext: string;
  category: 'Causal & Stats' | 'Affiliate Architecture' | 'Product Economics' | 'Governance';
}

export const GLOSSARY_TERMS: Record<string, TermDefinition> = {
  'ITT': {
    term: 'Intention-To-Treat (ITT)',
    shortDef: 'Causal standard analyzing all randomized users regardless of extension install status.',
    analystContext: 'Prevents "survivorship / opt-in bias". If we only measured users who clicked "Activate", power users would make the feature look artificially successful.',
    category: 'Causal & Stats',
  },
  'S2S Postback': {
    term: 'Server-to-Server (S2S) Postback',
    shortDef: 'Direct asynchronous server webhook from affiliate network to CashKaro tracking engine.',
    analystContext: 'Bypasses client-side ad-blockers and cookie deletions to guarantee 100% verified order attribution reconciliation.',
    category: 'Affiliate Architecture',
  },
  'SubID': {
    term: 'SubID Session Hashing',
    shortDef: 'Cryptographic click-identifier passed in affiliate deep-links.',
    analystContext: 'Enables deterministic order-to-user matching without passing personally identifiable information (PII) to 3rd-party merchants.',
    category: 'Affiliate Architecture',
  },
  'Attribution Guard': {
    term: 'Attribution Precedence Rule',
    shortDef: 'Fail-closed guardrail suppressing prompts if a foreign referral tag is detected.',
    analystContext: 'Protects merchant relationships and affiliate ecosystem rules by never overwriting a content creator or partner tracking code.',
    category: 'Governance',
  },
  'Cannibalization': {
    term: 'Cannibalization & Baseline Neutrality',
    shortDef: 'Accounting for orders that would have occurred through CashKaro organically.',
    analystContext: 'Our financial model applies a 5–10% neutrality haircut so leadership only pays for truly net-incremental GMV.',
    category: 'Product Economics',
  },
  'MDE': {
    term: 'Minimum Detectable Effect (MDE)',
    shortDef: 'Smallest true causal delta detectable with 80% power at α=0.05.',
    analystContext: 'Requires ~25,000 eligible users over a 4–6 week sample window to reliably detect a +0.08 to +0.12 orders/user lift.',
    category: 'Causal & Stats',
  },
};

interface GlossaryBadgeProps {
  termKey: keyof typeof GLOSSARY_TERMS;
  children?: React.ReactNode;
}

export const GlossaryBadge: React.FC<GlossaryBadgeProps> = ({ termKey, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const data = GLOSSARY_TERMS[termKey];

  if (!data) return <>{children || termKey}</>;

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="inline-flex items-center gap-1 font-semibold text-[#316BEA] hover:text-blue-800 underline decoration-dotted decoration-[#316BEA]/60 underline-offset-2 transition-colors cursor-help"
        aria-label={`Definition for ${data.term}`}
      >
        <span>{children || data.term}</span>
        <HelpCircle className="w-3 h-3 text-[#316BEA]/80 inline-block" />
      </button>

      {isOpen && (
        <span 
          className="block absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-3.5 bg-[#0B1728] dark:bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700/80 text-xs animate-in fade-in zoom-in-95 duration-150 text-left pointer-events-none"
        >
          <span className="flex items-center justify-between border-b border-slate-700/80 pb-1.5 mb-2">
            <span className="font-mono text-[10px] uppercase font-bold text-[#D190AC] dark:text-[#25C3FF]">
              {data.category}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Senior Analyst Glossary</span>
          </span>
          <span className="block font-bold text-slate-100 mb-1 text-sm font-display">
            {data.term}
          </span>
          <span className="block text-slate-300 text-[11px] leading-relaxed mb-2">
            {data.shortDef}
          </span>
          <span className="block p-2 rounded bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400">
            <strong className="text-amber-300 font-mono">Product Rationale:</strong> {data.analystContext}
          </span>
          <span className="block absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-[#0B1728] dark:border-t-slate-900" />
        </span>
      )}
    </span>
  );
};
