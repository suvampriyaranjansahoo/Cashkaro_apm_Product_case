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
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeMode } from '../types';

interface RecruiterStickyBarProps {
  onOpenRecruiterHub: () => void;
  onOpen1Pager: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenPdfExport?: () => void;
  onOpenPrintPreview?: () => void;
  onToggleOutline?: () => void;
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
}

export const RecruiterStickyBar: React.FC<RecruiterStickyBarProps> = ({
  onOpenRecruiterHub,
  onOpen1Pager,
  onNavigateSection,
  onOpenPdfExport,
  onOpenPrintPreview,
  onToggleOutline,
  themeMode,
  onToggleTheme,
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
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-6xl w-[96%] sm:w-auto flex justify-center pointer-events-none no-print">
      <motion.div
        layout
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 34,
          mass: 0.8,
        }}
        className={`pointer-events-auto bg-white/95 dark:bg-[#070D18]/95 backdrop-blur-md text-slate-800 dark:text-white border border-[#DEB6C5]/80 dark:border-slate-700/80 shadow-2xl overflow-hidden transition-colors ${
          minimized
            ? 'rounded-full px-4 py-2 cursor-pointer hover:border-[#D190AC] dark:hover:border-blue-500 hover:scale-[1.03]'
            : 'rounded-2xl p-2 sm:p-2.5 sm:px-3.5'
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
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-xs shadow-emerald-500/50" />
              <span className="text-xs font-semibold tracking-tight text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white">
                Recruiter Quick Navigation
              </span>
              <div className="flex items-center gap-1 text-[#8F3760] dark:text-[#38BDF8] text-[11px] font-medium bg-[#D190AC]/20 dark:bg-blue-500/10 px-2 py-0.5 rounded-full border border-[#DEB6C5]/70 dark:border-blue-400/20">
                <Maximize2 className="w-3 h-3" />
                <span>Expand Bar</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="expanded-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex items-center justify-between gap-2 sm:gap-3.5 max-w-full"
            >
              {/* Candidate Chip */}
              <div className="flex items-center gap-2 sm:gap-2.5 pl-1 sm:pl-2 pr-1 select-none shrink-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#D190AC] to-[#8F3760] dark:from-[#316BEA] dark:to-blue-500 flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0">
                  SP
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 whitespace-nowrap">
                    <span>Suvam Priyaranjan Sahoo</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">APM Candidate Dossier</div>
                </div>
              </div>

              {/* Quick Action Navigation Buttons */}
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 overflow-x-auto scrollbar-none py-0.5 shrink">
                {/* Recruiter Evaluation Hub */}
                <button
                  onClick={onOpenRecruiterHub}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-[#D190AC] to-[#8F3760] hover:from-[#c27d9c] hover:to-[#7c2f52] dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-500 dark:hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer hover:scale-[1.02] shrink-0 whitespace-nowrap"
                  title="Open Candidate Evaluation Scorecard & Rubric"
                >
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden xs:inline">Recruiter Hub</span>
                  <span className="xs:hidden">Hub</span>
                </button>

                {/* Outline Action */}
                {onToggleOutline && (
                  <button
                    onClick={onToggleOutline}
                    className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-[#F0EAD5] hover:bg-[#DEB6C5]/50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-[#DEB6C5]/60 dark:border-slate-700/40 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                    title="Toggle Expandable Document Outline (Alt+O)"
                  >
                    <ListOrdered className="w-3.5 h-3.5 text-[#8F3760] dark:text-cyan-400" />
                    <span>Outline</span>
                  </button>
                )}

                {/* 1-Pager Memo */}
                <button
                  onClick={onOpen1Pager}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-[#F0EAD5] hover:bg-[#DEB6C5]/50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-[#DEB6C5]/60 dark:border-slate-700/40 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                  title="View Executive 1-Pager Brief"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                  <span>1-Pager</span>
                </button>

                {/* Print Preview Action */}
                {onOpenPrintPreview && (
                  <button
                    onClick={onOpenPrintPreview}
                    className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-[#F0EAD5] hover:bg-[#DEB6C5]/50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-[#DEB6C5]/60 dark:border-slate-700/40 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                    title="Preview A4 print layout, margins, and page breaks"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>Preview</span>
                  </button>
                )}

                {/* PDF Export Action */}
                {onOpenPdfExport && (
                  <button
                    onClick={onOpenPdfExport}
                    className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-[#159A68] to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/40 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0 whitespace-nowrap"
                    title="Download Strategy Memo as PDF (Press 'D')"
                  >
                    <FileDown className="w-3.5 h-3.5 text-white" />
                    <span>Download PDF</span>
                    <span className="hidden md:inline-block px-1 py-0.2 bg-black/20 rounded text-[9px] font-mono text-emerald-100 ml-0.5">
                      D
                    </span>
                  </button>
                )}

                {/* Prototype Jump */}
                <button
                  onClick={() => onNavigateSection('intent-router')}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-[#F0EAD5] hover:bg-[#DEB6C5]/50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-[#DEB6C5]/60 dark:border-slate-700/40 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                  title="Jump to Interactive Intent Router Prototype"
                >
                  <Smartphone className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                  <span>Prototype</span>
                </button>

                {/* Simulator Jump */}
                <button
                  onClick={() => onNavigateSection('simulator')}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-[#F0EAD5] hover:bg-[#DEB6C5]/50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-[#DEB6C5]/60 dark:border-slate-700/40 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                  title="Jump to Financial Sensitivity Simulator"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>ROI Model</span>
                </button>

                {/* Theme Toggle Button with Smooth Sun-to-Moon Transition */}
                {onToggleTheme && (
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={onToggleTheme}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F0EAD5] hover:bg-[#DEB6C5]/50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-[#DEB6C5]/60 dark:border-slate-700/40 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap overflow-hidden"
                    title={themeMode === 'light' ? 'Switch to Dark Theme (Aquatic Blue)' : 'Switch to Light Theme (Cream Bunny with Rose)'}
                  >
                    <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                      <AnimatePresence mode="wait" initial={false}>
                        {themeMode === 'light' ? (
                          <motion.div
                            key="bottom-sun"
                            initial={{ rotate: -90, scale: 0.3, opacity: 0 }}
                            animate={{ rotate: 0, scale: 1, opacity: 1 }}
                            exit={{ rotate: 90, scale: 0.3, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 flex items-center justify-center text-amber-500"
                          >
                            <Sun className="w-3.5 h-3.5" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="bottom-moon"
                            initial={{ rotate: 90, scale: 0.3, opacity: 0 }}
                            animate={{ rotate: 0, scale: 1, opacity: 1 }}
                            exit={{ rotate: -90, scale: 0.3, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 flex items-center justify-center text-[#25C3FF]"
                          >
                            <Moon className="w-3.5 h-3.5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <span className="text-[11px] font-semibold">
                      {themeMode === 'light' ? 'Light' : 'Dark'}
                    </span>
                  </motion.button>
                )}

                {/* Candidate Email Copy */}
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-[#F0EAD5]/80 hover:bg-[#DEB6C5]/50 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-[#DEB6C5]/60 dark:border-slate-700/40 rounded-xl text-xs font-mono transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                  title="Copy candidate email: sahoosuvampriyaranjan10@gmail.com"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span className="text-[11px]">Email</span>
                    </>
                  )}
                </button>

                {/* Minimize Button */}
                <div className="h-5 w-px bg-[#DEB6C5]/60 dark:bg-slate-700 mx-0.5 shrink-0" />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMinimized(true);
                  }}
                  className="p-1.5 rounded-lg bg-[#F0EAD5] hover:bg-rose-500/20 hover:text-rose-600 dark:bg-slate-800/90 dark:hover:text-rose-400 text-slate-500 dark:text-slate-400 border border-[#DEB6C5]/60 dark:border-slate-700/60 transition-all cursor-pointer hover:border-rose-500/40 shrink-0"
                  title="Minimize bottom bar"
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
