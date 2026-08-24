import React, { useState, useEffect } from 'react';
import { ReadingDepth, ThemeMode } from './types';
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
import { ArrowUp, Sparkles, BookOpen, Printer, Sun, Moon, FileDown, Eye } from 'lucide-react';

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

  // Theme Management (system / dark / light)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme_mode');
    return (saved as ThemeMode) || 'system';
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
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = () => {
      const isDark =
        themeMode === 'dark' ||
        (themeMode === 'system' && mediaQuery.matches);
      
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();
    localStorage.setItem('theme_mode', themeMode);

    const listener = () => {
      if (themeMode === 'system') {
        applyTheme();
      }
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -72;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToFirstHighlight = () => {
    if (highlightedSections.length > 0) {
      scrollToSection(highlightedSections[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] dark:bg-[#070D18] text-[#0B1F3A] dark:text-slate-100 flex flex-col selection:bg-[#316BEA]/15 selection:text-[#316BEA] pb-16 transition-colors">
      
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
      <main className="flex-1">
        <HeroSection 
          readingDepth={readingDepth} 
          onOpenRecruiterHub={() => setRecruiterHubOpen(true)}
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

      {/* Floating Recruiter & Hiring Manager Action Bar */}
      <RecruiterStickyBar
        onOpenRecruiterHub={() => setRecruiterHubOpen(true)}
        onOpen1Pager={() => setExecSummaryOpen(true)}
        onNavigateSection={scrollToSection}
        onOpenPdfExport={() => setPdfExportOpen(true)}
        onOpenPrintPreview={() => setPrintPreviewOpen(true)}
        onToggleOutline={() => setOutlineOpen(prev => !prev)}
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

    </div>
  );
}

