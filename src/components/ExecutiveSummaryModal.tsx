import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Target, 
  ArrowUpRight, 
  AlertCircle,
  FileText,
  Download,
  Loader2
} from 'lucide-react';
import { generateExecutiveSummaryPdf } from '../utils/pdfExport';

interface ExecutiveSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveSummaryModal: React.FC<ExecutiveSummaryModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      await generateExecutiveSummaryPdf({
        candidateName: 'SUVAM PRIYARANJAN SAHOO',
        candidateEmail: 'sahoosuvampriyaranjan10@gmail.com',
      });
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopyText = () => {
    const text = `CASHKARO APM INVESTMENT MEMO (EXECUTIVE 1-PAGER)
Prepared by: Suvam Priyaranjan Sahoo
Product Thesis: Intent Router (Converting direct leakage to incremental tracked orders)

1. THE PROBLEM:
Existing high-frequency users know CashKaro's value but navigate directly to retailer sites by habit. Navigating back to restart the journey introduces high cognitive friction and cart-loss anxiety.

2. THE MECHANISM (INTENT ROUTER):
A consented, desktop-first Chrome extension for an allowlist of 3-5 key retailers. It activates affiliate attribution in 1-tap without disturbing the user's active cart or checkout flow.

3. GOVERNANCE & GATING:
- G1 Problem Discovery: ≥60% pass threshold on purchase reconstructions
- G2 Reach & Addressability: Powered sample size in 4-6 weeks
- G3 Technical & Postback Spike: 100% S2S reconciliation before full rollout
- G4 50/50 ITT Causal Experiment: Holdout test verifying true net incremental lift

4. FINANCIAL VIABILITY:
Break-even formula: ΔO_be = (Kf + Kr1) / (E * C)
At 25k eligible users, ₹85 contribution/order, and ₹600k Q1 cost, break-even requires just +0.28 incremental orders/user.

5. NON-NEGOTIABLE GUARDRAIL:
Attribution Precedence Rule: If a user arrives via an existing creator/affiliate link, CashKaro suppresses prompts fail-closed.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0E1726] border border-[#DCE4EE] dark:border-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0B1728] text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#316BEA] flex items-center justify-center font-display font-black text-lg text-white shadow-md">
              CK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-blue-400 font-bold">
                  Executive Briefing
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-semibold border border-emerald-500/30">
                  Ready for CPO Review
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display tracking-tight text-white">
                CashKaro Intent Router • 1-Page Investment Memo
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-[#316BEA] hover:bg-blue-600 text-white transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
              title="Download Executive 1-Pager as Vector A4 PDF"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyText}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-mono flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              title="Copy memo text"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Copy Summary</span>
                </>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-mono flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              title="Print document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
          
          {/* Top Key Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Target Metric</div>
              <div className="text-base sm:text-lg font-extrabold font-mono text-[#316BEA] dark:text-blue-400 mt-0.5">+0.12 ΔO / user</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Incremental Tracked Orders</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Evaluation Standard</div>
              <div className="text-base sm:text-lg font-extrabold font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">50/50 ITT</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Intention-to-Treat Holdout</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Q1 Target Net Margin</div>
              <div className="text-base sm:text-lg font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">₹1.52M+</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Gross Contribution Profit</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Safety Guardrail</div>
              <div className="text-base sm:text-lg font-extrabold font-mono text-amber-700 dark:text-amber-400 mt-0.5">Fail-Closed</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Attribution Precedence Locked</div>
            </div>
          </div>

          {/* 3 Pillar Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Pillar 1 */}
            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 space-y-2">
              <div className="flex items-center gap-2 text-[#316BEA] dark:text-blue-400 font-bold font-display text-sm">
                <Target className="w-4 h-4" />
                <span>1. Core Diagnosis</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                Direct leakage is not caused by lack of cashback awareness. High-intent existing shoppers remember CashKaro after arriving at merchant sites, but the friction of aborting the cart creates drop-off.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold font-display text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>2. The V1 Solution</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                A lightweight desktop Chrome extension deployed across an allowlist of 3–5 partner retailers. Injects the affiliate click-path in 1 tap without page reload or cart disturbance.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/30 space-y-2">
              <div className="flex items-center gap-2 text-purple-800 dark:text-purple-400 font-bold font-display text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>3. Gated Discipline</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                Structured through 4 sequential validation gates (G1 Discovery ≥60%, G2 Addressability, G3 S2S Postback Spike, G4 50/50 Causal Holdout). Zero engineering wasted on unverified assumptions.
              </p>
            </div>
          </div>

          {/* Causal Economics Formula */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400 uppercase font-semibold">
                Investment Break-Even Formula
              </span>
              <span className="font-mono text-xs text-emerald-400">ΔO_be = (Kf + Kr1) / (E × C)</span>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed font-mono">
              Where <strong className="text-white">Kf</strong> = One-time Build (₹4.5L), <strong className="text-white">Kr1</strong> = Q1 Ops (₹1.5L), <strong className="text-white">E</strong> = 25,000 users, <strong className="text-white">C</strong> = ₹85 net contribution. Required break-even lift is <strong className="text-emerald-300 font-bold">+0.28 orders/user/quarter</strong>.
            </div>
          </div>

          {/* Author Note */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>Authored by: <strong className="text-slate-800 dark:text-slate-200">Suvam Priyaranjan Sahoo</strong></span>
            <span>Target Role: <strong className="text-slate-800 dark:text-slate-200">Associate Product Manager (APM)</strong></span>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:block">
            Format: Standard A4 Vector PDF • Optimized for executive review
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="px-4 py-2 rounded-lg bg-[#316BEA] hover:bg-blue-600 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 1-Pager PDF</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
