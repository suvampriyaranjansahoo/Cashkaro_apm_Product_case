import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ReadingDepth, ThemeMode } from './types';
import { SECTIONS } from './data/caseData';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { HypothesesSection } from './components/HypothesesSection';
import { PrioritizationSection } from './components/PrioritizationSection';
import { ValidationGatesSection } from './components/ValidationGatesSection';
import { MindChangeSection } from './components/MindChangeSection';
import { IntentRouterShowcase } from './components/IntentRouterShowcase';
import { ProductSpecSection } from './components/ProductSpecSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { MeasurementSection } from './components/MeasurementSection';
import { ExperimentSimulator } from './components/ExperimentSimulator';
import { OperatingModelSection } from './components/OperatingModelSection';
import { FinalDecisionSection } from './components/FinalDecisionSection';
import { RecruiterHubModal } from './components/RecruiterHubModal';
import { RecruiterStickyBar } from './components/RecruiterStickyBar';
import { ExecutiveSummaryModal } from './components/ExecutiveSummaryModal';
import { PdfExportModal } from './components/PdfExportModal';
import { PrintPreviewModal } from './components/PrintPreviewModal';
import { OutlineSidebar } from './components/OutlineSidebar';
import { BackgroundDepthCanvas } from './components/BackgroundDepthCanvas';
import { ArrowUp, Sparkles, BookOpen, Printer, Sun, Moon, FileDown, Eye, Keyboard, ChevronDown, ChevronUp } from 'lucide-react';

export default function App() {
  const [readingDepth, setReadingDepth] = useState<ReadingDepth>('7m');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [recruiterHubOpen, setRecruiterHubOpen] = useState<boolean>(false);
  const [execSummaryOpen, setExecSummaryOpen] = useState<boolean>(false);
  const [pdfExportOpen, setPdfExportOpen] = useState<boolean>(false);
  const [printPreviewOpen, setPrintPreviewOpen] = useState<boolean>(false);
  const [outlineOpen, setOutlineOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('outline_sidebar_open');
      if (saved !== null) return saved === 'true';
      return typeof window !== 'undefined' && window.innerWidth >= 1440;
    } catch {
      return false;
    }
  });

  // Theme Management (light / dark)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('theme_mode');
      if (saved === 'dark' || saved === 'light') return saved as ThemeMode;
      return 'light';
    } catch {
      return 'light';
    }
  });

  // Recruiter Highlighted Insights State
  const [highlightedSections, setHighlightedSections] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('marked_insights');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Apply Theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme_mode', themeMode);
    } catch (e) {
      console.error(e);
    }
  }, [themeMode]);

  // Persist Highlights to LocalStorage
  const toggleHighlight = (sectionId: string) => {
    setHighlightedSections((prev) => {
      const exists = prev.includes(sectionId);
      const updated = exists ? prev.filter((id) => id !== sectionId) : [...prev, sectionId];
      try {
        localStorage.setItem('marked_insights', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save highlights:', e);
      }
      return updated;
    });
  };

  // Active section scrolling with keyboard shortcut support
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = useCallback((id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -72;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  const scrollToFirstHighlight = () => {
    if (highlightedSections.length > 0) {
      scrollToSection(highlightedSections[0]);
    }
  };

  // Keyboard Navigation: Arrow Keys (Up/Down, Left/Right), J/K, and D for PDF
  const [navToast, setNavToast] = useState<{ visible: boolean; label: string; sub?: string } | null>(null);

  const navigateRelativeSection = useCallback((direction: 'next' | 'prev') => {
    const currentIdx = SECTIONS.findIndex((s) => s.id === activeSection);
    let nextIdx = 0;
    if (currentIdx === -1) {
      nextIdx = direction === 'next' ? 0 : SECTIONS.length - 1;
    } else {
      nextIdx = direction === 'next' ? Math.min(SECTIONS.length - 1, currentIdx + 1) : Math.max(0, currentIdx - 1);
    }
    const targetSection = SECTIONS[nextIdx];
    if (targetSection && targetSection.id !== activeSection) {
      scrollToSection(targetSection.id);
      setNavToast({
        visible: true,
        label: `${targetSection.num}. ${targetSection.shortTitle}`,
        sub: direction === 'next' ? 'Next Section (↓ / →)' : 'Previous Section (↑ / ←)',
      });
    }
  }, [activeSection, scrollToSection]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is inside an input, textarea, or contentEditable
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      // If any major modal is open, let modal manage keys
      if (recruiterHubOpen || execSummaryOpen || printPreviewOpen) {
        if (e.key === 'Escape') {
          setRecruiterHubOpen(false);
          setExecSummaryOpen(false);
          setPrintPreviewOpen(false);
        }
        return;
      }

      if (pdfExportOpen) {
        if (e.key === 'Escape') {
          setPdfExportOpen(false);
        }
        return;
      }

      // Quick PDF Export shortcut: 'd' or 'p' or 'Ctrl/Cmd+P' override
      if ((e.key === 'd' || e.key === 'D') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setPdfExportOpen(true);
        return;
      }

      // Arrow navigation
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'j' || e.key === 'J') {
        // Prevent default only if Alt/Cmd not held
        if (!e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          navigateRelativeSection('next');
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'k' || e.key === 'K') {
        if (!e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          navigateRelativeSection('prev');
        }
      } else if ((e.key === 'o' || e.key === 'O') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOutlineOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    navigateRelativeSection, 
    recruiterHubOpen, 
    execSummaryOpen, 
    pdfExportOpen, 
    printPreviewOpen
  ]);

  // Auto-hide navigation toast after 1.5 seconds
  useEffect(() => {
    if (navToast?.visible) {
      const timer = setTimeout(() => {
        setNavToast(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [navToast]);

  return (
    <motion.div 
      layout
      animate={{
        backgroundColor: themeMode === 'dark' ? '#050E1A' : '#F7F6ED'
      }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="min-h-screen text-[#0B1F3A] dark:text-slate-100 flex flex-col selection:bg-[#316BEA]/15 selection:text-[#316BEA] pb-28 sm:pb-32 relative overflow-x-hidden"
    >
      {/* Animated Organic Ambient Theme Layer with Framer Motion */}
      <AnimatePresence mode="wait">
        <motion.div
          key={themeMode}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.75, ease: 'easeInOut' }}
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        >
          {themeMode === 'light' ? (
            /* Flowery Vibe: Soft Rose & Blossom Ambient Auras */
            <>
              <motion.div 
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.35, 0.48, 0.35],
                  x: [0, 20, 0],
                  y: [0, -15, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-24 right-[-5%] w-[650px] h-[650px] rounded-full bg-radial from-[#F0D6DE]/60 via-[#DEB6C5]/30 to-transparent blur-[100px]" 
              />
              <motion.div 
                animate={{
                  scale: [1, 1.12, 1],
                  opacity: [0.3, 0.42, 0.3],
                  x: [0, -25, 0],
                  y: [0, 20, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-[40%] left-[-10%] w-[700px] h-[700px] rounded-full bg-radial from-[#D190AC]/30 via-[#F0EAD5]/40 to-transparent blur-[120px]" 
              />
              <motion.div 
                animate={{
                  scale: [1, 1.06, 1],
                  opacity: [0.25, 0.38, 0.25]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute bottom-10 right-[15%] w-[550px] h-[550px] rounded-full bg-radial from-[#F0D6DE]/45 via-[#DEB6C5]/20 to-transparent blur-[110px]" 
              />
            </>
          ) : (
            /* Stormy Vibe: Tempest Dark, Deep Ocean & Ion Cyan Surges */
            <>
              <motion.div 
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.22, 0.38, 0.22],
                  x: [0, -30, 0],
                  y: [0, 25, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-32 left-[10%] w-[800px] h-[600px] rounded-full bg-radial from-[#00AFD3]/30 via-[#0080AB]/20 to-transparent blur-[120px]" 
              />
              <motion.div 
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.32, 0.2],
                  x: [0, 35, 0],
                  y: [0, -20, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute top-[45%] right-[-8%] w-[750px] h-[750px] rounded-full bg-radial from-[#25C3FF]/25 via-[#099AD9]/15 to-transparent blur-[130px]" 
              />
              <motion.div 
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.15, 0.28, 0.15]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-0 left-[20%] w-[600px] h-[600px] rounded-full bg-radial from-[#02FEFF]/20 via-[#0080AB]/15 to-transparent blur-[110px]" 
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 3D Depth Canvas with Sakura Floral Drift (Light) & Tempest Storm/Lightning (Dark) */}
      <BackgroundDepthCanvas themeMode={themeMode} />

      {/* Sticky Navigation Bar */}
      <Navigation
        readingDepth={readingDepth}
        setReadingDepth={setReadingDepth}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenRecruiterHub={() => setRecruiterHubOpen(true)}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        highlightedCount={highlightedSections.length}
        onScrollToFirstHighlight={scrollToFirstHighlight}
        onOpenPdfExport={() => setPdfExportOpen(true)}
        onOpenPrintPreview={() => setPrintPreviewOpen(true)}
        onToggleOutline={() => setOutlineOpen(prev => !prev)}
        isOutlineOpen={outlineOpen}
      />

      {/* Expandable Document Outline & Non-Linear Navigator Sidebar */}
      <OutlineSidebar
        isOpen={outlineOpen}
        setIsOpen={setOutlineOpen}
        activeSection={activeSection}
        onNavigateSection={scrollToSection}
        highlightedSections={highlightedSections}
        onToggleHighlight={toggleHighlight}
        readingDepth={readingDepth}
        onOpen1Pager={() => setExecSummaryOpen(true)}
        onOpenRecruiterHub={() => setRecruiterHubOpen(true)}
        onOpenPrintPreview={() => setPrintPreviewOpen(true)}
      />

      {/* Print-Ready Running Header (Visible only during PDF Export / Print) */}
      <div className="print-only print-ready-header">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-[#0B1F3A]">Product Case Study: Suvam Priyaranjan Sahoo</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 font-normal">CashKaro APM Strategic Investment Memo</span>
        </div>
        <div className="text-slate-500 font-mono text-[7.5pt]">
          sahoosuvampriyaranjan10@gmail.com • Confidential Evaluation
        </div>
      </div>

      {/* Print-Ready Running Footer (Visible only during PDF Export / Print) */}
      <div className="print-only print-ready-footer">
        <div className="text-slate-500 text-[7pt]">
          CashKaro APM Evaluation Review • Authored by Suvam Priyaranjan Sahoo
        </div>
        <div className="font-mono text-[#316BEA] font-semibold text-[7pt]">
          Confidential APM Hiring Dossier
        </div>
      </div>

      {/* Main Document Content */}
      <main className="flex-1 relative z-10">
        <HeroSection 
          readingDepth={readingDepth} 
          onOpenRecruiterHub={() => setRecruiterHubOpen(true)}
          onOpenPdfExport={() => setPdfExportOpen(true)}
        />
        <ProblemSection 
          readingDepth={readingDepth} 
          isHighlighted={highlightedSections.includes('problem')}
          onToggleHighlight={toggleHighlight}
        />
        <HypothesesSection 
          readingDepth={readingDepth} 
          isHighlighted={highlightedSections.includes('hypotheses')}
          onToggleHighlight={toggleHighlight}
        />
        <PrioritizationSection 
          readingDepth={readingDepth} 
          isHighlighted={highlightedSections.includes('prioritization')}
          onToggleHighlight={toggleHighlight}
        />
        <ValidationGatesSection 
          readingDepth={readingDepth} 
          isHighlighted={highlightedSections.includes('validation')}
          onToggleHighlight={toggleHighlight}
        />
        <MindChangeSection 
          readingDepth={readingDepth} 
          isHighlighted={highlightedSections.includes('mind-change')}
          onToggleHighlight={toggleHighlight}
        />
        <IntentRouterShowcase 
          readingDepth={readingDepth} 
          isHighlighted={highlightedSections.includes('intent-router')}
          onToggleHighlight={toggleHighlight}
        />
        <ProductSpecSection 
          readingDepth={readingDepth} 
          isHighlighted={highlightedSections.includes('product-spec')}
          onToggleHighlight={toggleHighlight}
        />
        <ArchitectureSection 
          readingDepth={readingDepth} 
          themeMode={themeMode}
          isHighlighted={highlightedSections.includes('architecture')}
          onToggleHighlight={toggleHighlight}
        />
        <MeasurementSection 
          readingDepth={readingDepth} 
          isHighlighted={highlightedSections.includes('measurement')}
          onToggleHighlight={toggleHighlight}
        />
        <ExperimentSimulator 
          readingDepth={readingDepth} 
          isHighlighted={highlightedSections.includes('simulator')}
          onToggleHighlight={toggleHighlight}
        />
        <OperatingModelSection 
          readingDepth={readingDepth} 
          isHighlighted={highlightedSections.includes('operating-model')}
          onToggleHighlight={toggleHighlight}
        />
        <FinalDecisionSection 
          readingDepth={readingDepth} 
          onOpenRecruiterHub={() => setRecruiterHubOpen(true)}
          isHighlighted={highlightedSections.includes('final-decision')}
          onToggleHighlight={toggleHighlight}
        />
      </main>

      {/* Floating Recruiter & Hiring Manager Action Bar with Minimize Effect */}
      <RecruiterStickyBar
        onOpenRecruiterHub={() => setRecruiterHubOpen(true)}
        onOpen1Pager={() => setExecSummaryOpen(true)}
        onNavigateSection={scrollToSection}
        onOpenPdfExport={() => setPdfExportOpen(true)}
        onOpenPrintPreview={() => setPrintPreviewOpen(true)}
        onToggleOutline={() => setOutlineOpen(prev => !prev)}
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')}
      />

      {/* Recruiter Evaluation Hub Modal */}
      <RecruiterHubModal
        isOpen={recruiterHubOpen}
        onClose={() => setRecruiterHubOpen(false)}
        onNavigateSection={scrollToSection}
        onOpenPdfExport={() => setPdfExportOpen(true)}
        onOpenPrintPreview={() => setPrintPreviewOpen(true)}
      />

      {/* Executive 1-Pager Modal */}
      <ExecutiveSummaryModal
        isOpen={execSummaryOpen}
        onClose={() => setExecSummaryOpen(false)}
      />

      {/* Recruiter PDF Export Modal */}
      <PdfExportModal
        isOpen={pdfExportOpen}
        onClose={() => setPdfExportOpen(false)}
        readingDepth={readingDepth}
        markedSectionIds={highlightedSections}
        onOpenPrintPreview={() => setPrintPreviewOpen(true)}
      />

      {/* Sandboxed A4 Print Preview Modal */}
      <PrintPreviewModal
        isOpen={printPreviewOpen}
        onClose={() => setPrintPreviewOpen(false)}
        readingDepth={readingDepth}
        markedSectionIds={highlightedSections}
      />

      {/* Dynamic Keyboard Navigation Toast HUD */}
      <AnimatePresence>
        {navToast?.visible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none no-print"
          >
            <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white border border-blue-500/50 px-4 py-2 rounded-full shadow-xl flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-400">
                <Keyboard className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span>{navToast.label}</span>
                </div>
                {navToast.sub && (
                  <div className="text-[10px] text-blue-300 font-mono">
                    {navToast.sub}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Minimal Footer */}
      <footer className="bg-[#0B1728] dark:bg-[#050A13] text-white py-12 border-t border-slate-800 dark:border-slate-900 text-xs no-print transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#316BEA] flex items-center justify-center font-display font-bold text-sm text-white">
              CK
            </div>
            <div>
              <div className="font-bold text-slate-100 font-display">
                CashKaro APM Product Case Study
              </div>
              <div className="text-slate-400 text-[11px]">
                Prepared by Suvam Priyaranjan Sahoo • Strategic Investment Memo
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <button
              onClick={() => setPrintPreviewOpen(true)}
              className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-cyan-400 hover:text-cyan-300"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Print Preview</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setPdfExportOpen(true)}
              className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-blue-400 hover:text-blue-300"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
            <span>•</span>
            <button
              onClick={() => window.print()}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="hover:text-[#316BEA] dark:hover:text-[#60A5FA] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

    </motion.div>
  );
}
