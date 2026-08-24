import React, { useState, useEffect } from 'react';
import { 
  Award, 
  FileText, 
  Smartphone, 
  TrendingUp, 
  Mail, 
  Check, 
  FileDown,
  Eye,
  ListOrdered,
  Maximize2,
  Minimize2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RecruiterStickyBarProps {
  onOpenRecruiterHub: () => void;
  onOpen1Pager: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenPdfExport?: () => void;
  onOpenPrintPreview?: () => void;
  onToggleOutline?: () => void;
}

export const RecruiterStickyBar: React.FC<RecruiterStickyBarProps> = ({
  onOpenRecruiterHub,
  onOpen1Pager,
  onNavigateSection,
  onOpenPdfExport,
  onOpenPrintPreview,
  onToggleOutline,
}) => {
  const [minimized, setMinimized] = useState<boolean>(() => {
    try {
      return localStorage.getItem('recruiter_bar_minimized') === 'true';
    } catch {
      return false;
    }
  });
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('recruiter_bar_minimized', String(minimized));
    } catch (e) {
      console.error(e);
    }
  }, [minimized]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('sahoosuvampriyaranjan10@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[94%] sm:w-auto flex justify-center pointer-events-none no-print">
      <motion.div
        layout
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 34,
          mass: 0.8,
        }}
        className={`pointer-events-auto bg-[#0B1728]/95 dark:bg-[#070D18]/95 backdrop-blur-md text-white border border-slate-700/80 shadow-2xl overflow-hidden ${
          minimized
            ? 'rounded-full px-3.5 py-2 cursor-pointer hover:border-blue-500 hover:scale-[1.03] transition-colors'
            : 'rounded-2xl p-2 sm:p-2.5'
        }`}
        onClick={minimized ? () => setMinimized(false) : undefined}
      >
        <AnimatePresence mode="wait" initial={false}>
          {minimized ? (
            <motion.div
              key="minimized-view"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="flex items-center gap-2.5 select-none"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400/50" />
              <span className="text-xs font-semibold tracking-tight text-slate-200 hover:text-white">
                Recruiter Quick Bar
              </span>
              <div className="flex items-center gap-1 text-[#38BDF8] text-[11px] font-medium bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-400/20">
                <Maximize2 className="w-3 h-3" />
                <span>Restore</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="expanded-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex items-center justify-between gap-2 sm:gap-3"
            >
              {/* Candidate Chip */}
              <div className="flex items-center gap-2.5 pl-2 pr-1 select-none">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#316BEA] to-blue-500 flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0">
                  SP
                </div>
                <div className="hidden md:block text-left leading-tight">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Suvam Priyaranjan Sahoo</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">APM Candidate Evaluation</div>
                </div>
              </div>

              {/* Quick Action Pills */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Recruiter Evaluation Hub */}
                <button
                  onClick={onOpenRecruiterHub}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer hover:scale-[1.02]"
                  title="Open Candidate Evaluation Scorecard & Rubric"
                >
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Recruiter Hub</span>
                  <span className="sm:hidden">Hub</span>
                </button>

                {/* Outline Action */}
                {onToggleOutline && (
                  <button
                    onClick={onToggleOutline}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    title="Toggle Expandable Document Outline (Alt+O)"
                  >
                    <ListOrdered className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">Outline</span>
                  </button>
                )}

                {/* 1-Pager Memo */}
                <button
                  onClick={onOpen1Pager}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  title="View Executive 1-Pager Brief"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">1-Pager</span>
                </button>

                {/* Print Preview Action */}
                {onOpenPrintPreview && (
                  <button
                    onClick={onOpenPrintPreview}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    title="Preview A4 print layout, margins, and page breaks"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden md:inline">Preview</span>
                  </button>
                )}

                {/* PDF Export Action */}
                {onOpenPdfExport && (
                  <button
                    onClick={onOpenPdfExport}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    title="Download Strategy Memo as PDF"
                  >
                    <FileDown className="w-3.5 h-3.5 text-blue-400" />
                    <span className="hidden md:inline">PDF</span>
                  </button>
                )}

                {/* Prototype Jump */}
                <button
                  onClick={() => onNavigateSection('intent-router')}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  title="Jump to Interactive Intent Router Prototype"
                >
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden md:inline">Prototype</span>
                </button>

                {/* Simulator Jump */}
                <button
                  onClick={() => onNavigateSection('simulator')}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  title="Jump to Financial Sensitivity Simulator"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">ROI Model</span>
                </button>

                {/* Candidate Email Copy */}
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-mono transition-colors cursor-pointer"
                  title="Copy candidate email: sahoosuvampriyaranjan10@gmail.com"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-[11px]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="hidden lg:inline text-[11px]">Email</span>
                    </>
                  )}
                </button>

                {/* Minimize Button */}
                <div className="h-5 w-px bg-slate-700 mx-0.5" />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMinimized(true);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 border border-slate-700/60 transition-all cursor-pointer hover:border-rose-500/40"
                  title="Minimize / hide this bottom bar to clear your view"
                  aria-label="Minimize bottom bar"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
