import React, { useState } from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  Target, 
  ShieldCheck, 
  Cpu, 
  FileText, 
  Copy, 
  Check, 
  Mail, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Layers,
  ArrowUpRight,
  Download,
  Star,
  FileDown,
  BookOpen,
  Eye,
  Loader2
} from 'lucide-react';
import { generateExact14PageCasePdf } from '../utils/exactDocExport';

interface RecruiterHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenPdfExport?: () => void;
  onOpenPrintPreview?: () => void;
}

export const RecruiterHubModal: React.FC<RecruiterHubModalProps> = ({ 
  isOpen, 
  onClose,
  onNavigateSection,
  onOpenPdfExport,
  onOpenPrintPreview 
}) => {
  const [copiedNote, setCopiedNote] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<number>(0);
  const [isDownloadingExact, setIsDownloadingExact] = useState(false);

  if (!isOpen) return null;

  const candidateInfo = {
    name: 'Suvam Priyaranjan Sahoo',
    role: 'Associate Product Manager (APM)',
    email: 'sahoosuvampriyaranjan10@gmail.com',
    caseTitle: 'CashKaro Intent Router: Converting Leakage into Tracked Orders',
    targetCompany: 'CashKaro / Pouring Pounds',
  };

  const apmCompetencies = [
    {
      id: 'diagnosis',
      title: '1. Problem Framing & Diagnosis',
      score: 'Senior APM Level',
      sectionId: 'problem',
      summary: 'Identified that leakage is NOT caused by cashback unawareness, but late-stage recall and restart friction.',
      evidence: [
        'Recognized existing users have high affinity but direct-shopping habits.',
        'Articulated cart-loss anxiety and context switching as the root friction.',
        'Established pre-build G1 validation rule (≥60% problem prevalence).',
      ],
      callout: 'Saves 3–4 sprints of engineering by testing the premise before building.',
    },
    {
      id: 'hypotheses',
      title: '2. Hypothesis-Led Strategy',
      score: 'Principal APM Level',
      sectionId: 'hypotheses',
      summary: 'Formulated 4 distinct behavioral hypotheses and systematically invalidated high-risk alternatives.',
      evidence: [
        'Rejected generic browser extension bloat (annoying popups on all sites).',
        'Rejected push notification spam (high uninstall risk, low contextual relevance).',
        'Scoped V1 strictly to an allowlist of 3–5 partner merchants with 1-tap activation.',
      ],
      callout: 'Demonstrates strong prioritization discipline and ecosystem safety awareness.',
    },
    {
      id: 'causality',
      title: '3. Causal & Statistical Rigor',
      score: 'Senior Analyst Level',
      sectionId: 'measurement',
      summary: 'Built a persistent 50/50 Intention-To-Treat (ITT) holdout model that rejects vanity metrics.',
      evidence: [
        'Pre-registered ITT metric: Incremental tracked orders / eligible user.',
        'Accounted for survivorship bias by analyzing non-installers in treatment.',
        'Calculated statistical power (>94% at 25,000 users) and postback maturation lag.',
      ],
      callout: 'Refuses to count "assisted orders" that would have happened organically.',
    },
    {
      id: 'systems',
      title: '4. Systems & Technical Feasibility',
      score: 'Tech-Forward PM',
      sectionId: 'architecture',
      summary: 'Specified S2S webhooks, SubID session tokens, and a fail-closed Attribution Precedence Guard.',
      evidence: [
        'Zero-trust attribution rule: Never overwrites existing creator/affiliate tokens.',
        'Designed lightweight Chrome manifest v3 architecture (<150ms execution).',
        'Defined G3 Technical Spike to verify 100% affiliate reconciliation before rollout.',
      ],
      callout: 'Understands affiliate networks, anti-tamper security, and merchant policies.',
    },
    {
      id: 'economics',
      title: '5. Commercial & Unit Economics',
      score: 'Commercial PM',
      sectionId: 'simulator',
      summary: 'Formulated a mathematical break-even model balancing build costs (Kf) and recurring ops (Kr1).',
      evidence: [
        'Derived break-even lift formula: ΔO_be = (Kf + Kr1) / (E × C).',
        'Incorporated a 5–10% cannibalization haircut to ensure conservative profitability.',
        'Delivers modeled ₹15.2L+ Q1 gross contribution profit at base assumptions.',
      ],
      callout: 'Directly links product changes to company P&L and payback timelines.',
    },
  ];

  const handleDownloadExactPdf = async () => {
    setIsDownloadingExact(true);
    try {
      await generateExact14PageCasePdf();
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setIsDownloadingExact(false);
    }
  };

  const handleCopyRecruiterNote = () => {
    const note = `APM CANDIDATE EVALUATION BRIEF:
Candidate: ${candidateInfo.name}
Role Target: ${candidateInfo.role}
Email: ${candidateInfo.email}
Case Study: ${candidateInfo.caseTitle}

KEY COMPETENCY HIGHLIGHTS:
1. Problem Diagnosis: Identifies late-stage recall & restart friction as true leakage root cause.
2. Strategy Discipline: Rejects bloated extensions in favor of a 1-tap allowlisted Intent Router.
3. Experimentation: Designs 50/50 ITT holdout preventing vanity / survivorship bias.
4. Technical Sense: Specifies S2S Postbacks, SubID session security, and Attribution Precedence Guard.
5. Unit Economics: Formulates formulaic break-even sensitivity model with cannibalization haircuts.

Recommendation: Advance to final APM/PM rounds.`;
    navigator.clipboard.writeText(note);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Recruiter Ribbon */}
        <div className="bg-gradient-to-r from-[#0B1728] via-[#132845] to-[#0B1728] text-white p-5 sm:p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#316BEA] to-blue-700 flex items-center justify-center font-display font-black text-xl text-white shadow-lg shrink-0 border border-white/20">
              SP
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold border border-blue-500/30">
                  APM Candidate Profile
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                  5/5 Rubric Dimensions Mastered
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-white">
                {candidateInfo.name}
              </h2>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Target Role: <strong className="text-white">{candidateInfo.role}</strong> • Email: <a href={`mailto:${candidateInfo.email}`} className="text-[#38BDF8] underline">{candidateInfo.email}</a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Primary Direct Download Exact File Button */}
            <button
              onClick={handleDownloadExactPdf}
              disabled={isDownloadingExact}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-[1.02] cursor-pointer disabled:opacity-50"
              title="Download the exact 14-page official submission PDF"
            >
              {isDownloadingExact ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Generating 14-Page PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-emerald-200" />
                  <span>Download Exact 14-Page Case</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyRecruiterNote}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shadow-sm cursor-pointer"
              title="Copy candidate feedback note"
            >
              {copiedNote ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-mono text-xs">Copied Summary</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-blue-400" />
                  <span>Copy Brief</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-slate-800">
          
          {/* Executive Recruiter Value Pitch */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/40 border border-blue-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#316BEA] font-bold font-display text-sm">
                <Sparkles className="w-4 h-4 text-[#316BEA]" />
                <span>Why Suvam Stands Out in the APM Cohort:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
                Unlike surface-level PM cases that jump to feature ideas or AI buzzwords, this work applies <strong>causal econometric rigor, ecosystem safety guardrails, and formulaic break-even financial thresholds</strong> to solve high-intent user leakage.
              </p>
            </div>

            <div className="flex sm:flex-col gap-2 shrink-0">
              <button
                onClick={() => { onClose(); onNavigateSection('intent-router'); }}
                className="px-4 py-2 rounded-xl bg-[#316BEA] hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span>Interactive Prototype</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { onClose(); onNavigateSection('simulator'); }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span>Sensitivity Simulator</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Exact 14-Page File Download Card for Hiring Committee */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-sm text-slate-900">
                    Official 14-Page CashKaro APM Submission File
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold border border-emerald-300">
                    Exact Dossier PDF
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  Download the complete, unabridged assignment document containing all 14 structured pages, candidate problem framing, G1–G4 gates, S2S architecture flows, break-even unit economics, and executive sign-off.
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadExactPdf}
              disabled={isDownloadingExact}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0 cursor-pointer self-start sm:self-auto hover:scale-[1.02] disabled:opacity-50"
            >
              {isDownloadingExact ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Exact PDF (14 Pages)</span>
                </>
              )}
            </button>
          </div>

          {/* 5-Competency APM Evaluation Framework */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-extrabold text-base sm:text-lg text-[#0B1F3A] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#316BEA]" />
                <span>APM Candidate Competency Scorecard (5 Pillars)</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">Click any card to jump to section</span>
            </div>

            {/* Competency Pills Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-4">
              {apmCompetencies.map((comp, idx) => (
                <button
                  key={comp.id}
                  onClick={() => setSelectedPillar(idx)}
                  className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                    selectedPillar === idx
                      ? 'bg-[#0B1728] text-white border-slate-900 shadow-md scale-[1.02]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-70">
                    Pillar {idx + 1}
                  </div>
                  <div className="text-xs font-bold font-display truncate mt-0.5">
                    {comp.title.split('. ')[1]}
                  </div>
                  <div className="text-[10px] text-emerald-500 font-mono mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Validated</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Pillar In-Depth Inspector */}
            {(() => {
              const comp = apmCompetencies[selectedPillar];
              return (
                <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#38BDF8] font-bold">
                        Pillar {selectedPillar + 1} Evaluation Deep Dive
                      </span>
                      <h4 className="text-lg font-bold font-display text-white">
                        {comp.title}
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 self-start sm:self-auto">
                      {comp.score}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {comp.summary}
                  </p>

                  {/* Concrete Candidate Proof Points */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                      Demonstrated Proof Points in Memo:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-200">
                      {comp.evidence.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="text-xs text-amber-300 font-mono flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{comp.callout}</span>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onNavigateSection(comp.sectionId);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#316BEA] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors self-end sm:self-auto shrink-0 cursor-pointer"
                    >
                      <span>Jump to {comp.title.split('. ')[1]} Section</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>

          {/* Recruiter Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Direct Contact</span>
              <div className="font-bold text-slate-900 text-sm">{candidateInfo.name}</div>
              <div className="text-xs text-[#316BEA] font-mono">{candidateInfo.email}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Interview Artifacts</span>
              <div className="font-bold text-slate-900 text-sm">Full Investment Memo</div>
              <div className="text-xs text-slate-500">14 Structured Exact Pages</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Decision Framework</span>
              <div className="font-bold text-slate-900 text-sm">G1–G4 Kill-Gate Model</div>
              <div className="text-xs text-emerald-600 font-semibold">Zero-Dogma Scale/Kill Rule</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-mono">
            Prepared by <strong className="text-slate-800">Suvam Priyaranjan Sahoo</strong> • APM Product Strategy Case
          </div>

          <div className="flex items-center gap-2">
            {onOpenPrintPreview && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPrintPreview();
                }}
                className="px-3.5 py-2 rounded-xl bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Print Preview</span>
              </button>
            )}
            {onOpenPdfExport && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPdfExport();
                }}
                className="px-4 py-2 rounded-xl bg-blue-50 text-[#316BEA] hover:bg-blue-100 border border-blue-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>Export PDF Options</span>
              </button>
            )}
            <button
              onClick={handleCopyRecruiterNote}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
            >
              {copiedNote ? 'Copied to Clipboard!' : 'Copy Evaluation Note'}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#0B1728] text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close Hub
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
