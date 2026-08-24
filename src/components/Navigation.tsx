import React, { useState, useEffect } from 'react';
import { SECTIONS } from '../data/caseData';
import { ReadingDepth, ThemeMode } from '../types';
import { 
  Compass, 
  Clock, 
  Layers, 
  FileText, 
  ChevronRight, 
  Printer, 
  Sparkles, 
  Search, 
  X, 
  CheckCircle2, 
  ArrowUpRight,
  Bookmark,
  Award,
  Sun,
  Moon,
  Monitor,
  FileDown,
  Eye,
  ListOrdered
} from 'lucide-react';
import { ExecutiveSummaryModal } from './ExecutiveSummaryModal';

interface NavigationProps {
  readingDepth: ReadingDepth;
  setReadingDepth: (depth: ReadingDepth) => void;
  activeSection: string;
  setActiveSection: (id: string) => void;
  onOpenRecruiterHub?: () => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  highlightedCount?: number;
  onScrollToFirstHighlight?: () => void;
  onOpenPdfExport?: () => void;
  onOpenPrintPreview?: () => void;
  onToggleOutline?: () => void;
  isOutlineOpen?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  readingDepth,
  setReadingDepth,
  activeSection,
  setActiveSection,
  onOpenRecruiterHub,
  themeMode,
  setThemeMode,
  highlightedCount = 0,
  onScrollToFirstHighlight,
  onOpenPdfExport,
  onOpenPrintPreview,
  onToggleOutline,
  isOutlineOpen = false,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [execModalOpen, setExecModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }

      // Auto update active section based on scroll position
      const scrollPosition = window.scrollY + 200;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setActiveSection]);

  const cycleTheme = () => {
    if (themeMode === 'light') setThemeMode('dark');
    else if (themeMode === 'dark') setThemeMode('system');
    else setThemeMode('light');
  };

  const getThemeTitle = () => {
    if (themeMode === 'light') return 'Theme: Light (Click for Dark)';
    if (themeMode === 'dark') return 'Theme: Dark (Click for System)';
    return 'Theme: System-Aware (Click for Light)';
  };

  const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);
  const currentSectionObj = SECTIONS[currentIndex] || SECTIONS[0];
  const displayIndex = currentIndex >= 0 ? String(currentIndex + 1).padStart(2, '0') : '01';
  const totalSections = String(SECTIONS.length).padStart(2, '0');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setSearchOpen(false);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -72;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const filteredSections = SECTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary30s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Scroll Progress Bar at top */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-slate-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#316BEA] via-[#38BDF8] to-[#159A68] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#0B1728]/95 dark:bg-[#070D18]/95 backdrop-blur-md text-white border-b border-slate-800 dark:border-slate-800/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Logo & Case Tag */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => scrollToSection('hero')}
              className="flex items-center gap-2 text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#316BEA] flex items-center justify-center font-display font-bold text-sm tracking-tighter text-white shadow-sm group-hover:scale-105 transition-transform">
                CK
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400">APM Memo</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#159A68]"></span>
                </div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors truncate max-w-[140px] sm:max-w-none">
                  CashKaro Intent Router
                </div>
              </div>
            </button>
          </div>

          {/* Center: Reading Progress & Section Breadcrumb */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 border border-slate-800 dark:border-slate-700 bg-slate-900/80 px-3 py-1 rounded-full">
            <span className="font-mono text-[#316BEA] dark:text-[#60A5FA] font-bold">{Math.round(scrollProgress)}% read</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-medium truncate max-w-[220px]">
              {currentSectionObj.shortTitle}: {currentSectionObj.title}
            </span>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Recruiter & Hiring Manager Evaluation Hub */}
            {onOpenRecruiterHub && (
              <button
                onClick={onOpenRecruiterHub}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 via-blue-600/30 to-indigo-600/30 hover:from-amber-500/30 hover:to-indigo-600/50 text-amber-200 hover:text-white border border-amber-500/40 rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
                title="Open Recruiter & Hiring Manager Evaluation Hub"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Recruiter Hub</span>
                <span className="sm:hidden">Scorecard</span>
              </button>
            )}

            {/* Recruiter Marked Insights Badge */}
            {highlightedCount > 0 && (
              <button
                onClick={onScrollToFirstHighlight}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 rounded-lg text-xs font-medium transition-all cursor-pointer animate-in fade-in"
                title="Jump to recruiter marked insights"
              >
                <Bookmark className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-mono text-[11px] font-bold">{highlightedCount} Saved</span>
              </button>
            )}

            {/* Executive 1-Pager Button */}
            <button
              onClick={() => setExecModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#316BEA] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="Open Executive 1-Pager Memo"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">1-Pager View</span>
              <span className="sm:hidden">1-Pager</span>
            </button>

            {/* Outline Button */}
            {onToggleOutline && (
              <button
                onClick={onToggleOutline}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer border ${
                  isOutlineOpen
                    ? 'bg-[#316BEA] text-white border-blue-500'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border-slate-700/80'
                }`}
                title="Toggle Expandable Document Outline (Shortcut: Alt+O)"
              >
                <ListOrdered className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">Outline</span>
              </button>
            )}

            {/* Print Preview Button */}
            {onOpenPrintPreview && (
              <button
                onClick={onOpenPrintPreview}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
                title="Open Sandboxed A4 Print Preview to inspect layout, spacing & page breaks"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Preview</span>
              </button>
            )}

            {/* Export PDF Button */}
            {onOpenPdfExport && (
              <button
                onClick={onOpenPdfExport}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
                title="Export Strategy Memo as PDF (Executive Brief or Full Dossier)"
              >
                <FileDown className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden md:inline">Export PDF</span>
                <span className="md:hidden">PDF</span>
              </button>
            )}

            {/* Reading Depth Pill Switcher */}
            <div className="bg-slate-900 dark:bg-slate-950 border border-slate-700/80 p-0.5 rounded-lg flex items-center text-xs">
              <button
                onClick={() => setReadingDepth('30s')}
                className={`px-2 py-1 rounded font-semibold transition-all cursor-pointer ${
                  readingDepth === '30s'
                    ? 'bg-[#316BEA] text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="30-second executive summary mode"
              >
                30s
              </button>
              <button
                onClick={() => setReadingDepth('2m')}
                className={`px-2 py-1 rounded font-semibold transition-all cursor-pointer ${
                  readingDepth === '2m'
                    ? 'bg-[#316BEA] text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="2-minute core product strategy"
              >
                2m
              </button>
              <button
                onClick={() => setReadingDepth('7m')}
                className={`px-2 py-1 rounded font-semibold transition-all cursor-pointer ${
                  readingDepth === '7m'
                    ? 'bg-[#316BEA] text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="7-minute comprehensive technical memo"
              >
                7m
              </button>
            </div>

            {/* Theme Toggle Button (Light / Dark / System) */}
            <button
              onClick={cycleTheme}
              className="p-2 text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all cursor-pointer flex items-center gap-1"
              title={getThemeTitle()}
              aria-label={getThemeTitle()}
            >
              {themeMode === 'light' && <Sun className="w-4 h-4 text-amber-400" />}
              {themeMode === 'dark' && <Moon className="w-4 h-4 text-blue-400" />}
              {themeMode === 'system' && <Monitor className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Quick Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Search sections (Cmd+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Section Counter Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 dark:bg-slate-950 border border-slate-700/80 rounded-md font-mono text-xs text-slate-300">
              <span className="text-[#316BEA] dark:text-[#60A5FA] font-bold">{displayIndex}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">{totalSections}</span>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-800 bg-[#0B1728] dark:bg-[#070D18] px-4 py-3 max-h-96 overflow-y-auto animate-in slide-in-from-top-2 duration-150">
            <div className="grid grid-cols-2 gap-1.5">
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`text-left px-3 py-2 rounded text-xs flex items-center justify-between cursor-pointer ${
                    activeSection === sec.id
                      ? 'bg-[#316BEA] text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{sec.shortTitle}</span>
                  <span className="font-mono text-[10px] text-slate-400">{sec.num}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Reading Depth Banner */}
      <div className="bg-[#EBF2FE] dark:bg-slate-900/90 border-b border-[#D4E4FC] dark:border-slate-800 py-2 px-4 text-xs text-[#0B1F3A] dark:text-slate-200 flex items-center justify-between max-w-7xl mx-auto rounded-b-lg mb-4 transition-colors">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#316BEA] dark:text-[#60A5FA] shrink-0" />
          <span>
            {readingDepth === '30s' && (
              <strong>30s Executive View Active:</strong>
            )}
            {readingDepth === '2m' && (
              <strong>2m PM Core View Active:</strong>
            )}
            {readingDepth === '7m' && (
              <strong>7m Full Senior Analyst Memo Active:</strong>
            )}
            {' '}
            {readingDepth === '30s' && 'Highlighting executive takeaways, problem diagnosis, core bet, and decision rule.'}
            {readingDepth === '2m' && 'Displaying full hypotheses, interactive prototypes, validation gates, and experiment design.'}
            {readingDepth === '7m' && 'Comprehensive mode including architectural flows, code acceptance criteria, sensitivity equations, and RACI.'}
          </span>
        </div>
        <button
          onClick={() => setReadingDepth(readingDepth === '7m' ? '30s' : readingDepth === '30s' ? '2m' : '7m')}
          className="text-[#316BEA] dark:text-blue-400 hover:underline font-medium shrink-0 ml-3 flex items-center gap-1 cursor-pointer"
        >
          Toggle depth <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0E1726] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 ml-2" />
              <input
                type="text"
                placeholder="Jump to section, hypothesis, gate, or formula..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none py-1 bg-transparent"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-start gap-3 group cursor-pointer"
                >
                  <span className="font-mono text-xs font-semibold text-[#316BEA] dark:text-[#60A5FA] bg-blue-50 dark:bg-blue-950/80 px-1.5 py-0.5 rounded shrink-0">
                    {sec.num}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-[#316BEA] dark:group-hover:text-blue-400">
                      {sec.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {sec.summary30s}
                    </div>
                  </div>
                </button>
              ))}
              {filteredSections.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  No matching sections found for "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Executive 1-Pager Briefing Modal */}
      <ExecutiveSummaryModal
        isOpen={execModalOpen}
        onClose={() => setExecModalOpen(false)}
      />
    </>
  );
};

