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
  FileDown,
  Eye,
  ListOrdered,
  Route,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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

  // Global Cmd+K / Ctrl+K shortcut to open section search modal
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [searchOpen]);

  const toggleTheme = () => {
    const nextMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
  };

  const getThemeTitle = () => {
    if (themeMode === 'light') return 'Switch to Dark Theme (Aquatic Blue)';
    return 'Switch to Light Theme (Cream Bunny with Rose)';
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
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 dark:bg-[#070D18]/95 backdrop-blur-md text-[#0B1F3A] dark:text-white border-b border-[#E2DDD0] dark:border-slate-800/80 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-8 h-16 flex items-center justify-between gap-1.5 sm:gap-3">
          
          {/* Logo & Case Tag */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              onClick={() => scrollToSection('hero')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
              title="Return to Strategy Memo Overview"
            >
              {/* Multidimensional Brand Icon */}
              <div className="relative w-9 h-9 rounded-xl p-[1.5px] bg-gradient-to-br from-[#316BEA] via-[#00AFD3] to-[#D190AC] shadow-xs group-hover:scale-105 transition-all duration-300 shrink-0">
                <div className="w-full h-full bg-white dark:bg-[#070D18] rounded-[10px] flex items-center justify-center relative overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#316BEA]/15 dark:from-[#316BEA]/30 via-transparent to-[#00AFD3]/15 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <Route className="w-4 h-4 text-[#316BEA] dark:text-[#38BDF8] group-hover:scale-110 transition-transform relative z-10" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#159A68] border-2 border-white dark:border-[#070D18]" />
                </div>
              </div>

              {/* Brand Typography & Status */}
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-display font-bold text-sm tracking-tight text-[#0B1F3A] dark:text-white group-hover:text-[#316BEA] dark:group-hover:text-[#38BDF8] transition-colors">
                    CashKaro
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-500/20 text-[#316BEA] dark:text-[#60A5FA] border border-blue-200 dark:border-blue-500/30">
                    Router
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#159A68] animate-pulse"></span>
                  <span className="text-[10px] tracking-wide font-medium text-slate-500 dark:text-slate-400">
                    APM Strategy Memo
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Center: Reading Progress & Section Breadcrumb */}
          <div className="hidden 2xl:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 border border-[#E2DDD0] dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-1 rounded-full shrink-0 shadow-2xs">
            <span className="font-mono text-[#316BEA] dark:text-[#60A5FA] font-bold">{Math.round(scrollProgress)}%</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[180px]">
              {currentSectionObj.shortTitle}: {currentSectionObj.title}
            </span>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 shrink-0">
            
            {/* Recruiter & Hiring Manager Evaluation Hub */}
            {onOpenRecruiterHub && (
              <button
                onClick={onOpenRecruiterHub}
                className="flex items-center gap-1.5 px-2 sm:px-2.5 lg:px-3 py-1.5 bg-gradient-to-r from-amber-500/10 via-blue-50 to-indigo-50 dark:from-amber-500/20 dark:via-blue-600/30 dark:to-indigo-600/30 hover:from-amber-500/20 hover:to-indigo-100 dark:hover:from-amber-500/30 dark:hover:to-indigo-600/50 text-amber-900 dark:text-amber-200 hover:text-amber-950 dark:hover:text-white border border-amber-300 dark:border-amber-500/40 rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
                title="Open Recruiter & Hiring Manager Evaluation Hub"
              >
                <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="hidden md:inline">Recruiter Hub</span>
                <span className="hidden xs:inline md:hidden">Hub</span>
              </button>
            )}

            {/* Recruiter Marked Insights Badge */}
            {highlightedCount > 0 && (
              <button
                onClick={onScrollToFirstHighlight}
                className="hidden sm:flex items-center gap-1 px-2 py-1.5 bg-amber-50 dark:bg-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/30 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/50 rounded-lg text-xs font-medium transition-all cursor-pointer animate-in fade-in shrink-0"
                title="Jump to recruiter marked insights"
              >
                <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                <span className="font-mono text-[11px] font-bold">{highlightedCount}</span>
                <span className="hidden lg:inline text-[11px]">Saved</span>
              </button>
            )}

            {/* Executive 1-Pager Button */}
            <button
              onClick={() => setExecModalOpen(true)}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 lg:px-3 py-1.5 bg-gradient-to-r from-[#316BEA] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
              title="Open Executive 1-Pager Memo"
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">1-Pager</span>
            </button>

            {/* Outline Button */}
            {onToggleOutline && (
              <button
                onClick={onToggleOutline}
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer border shrink-0 ${
                  isOutlineOpen
                    ? 'bg-[#316BEA] text-white border-blue-500'
                    : 'bg-white hover:bg-[#F2EFE9] dark:bg-slate-900 dark:hover:bg-slate-800 text-[#0B1F3A] dark:text-slate-200 border-[#D8D2C4] dark:border-slate-700/80'
                }`}
                title="Toggle Expandable Document Outline (Shortcut: Alt+O)"
              >
                <ListOrdered className="w-3.5 h-3.5 text-[#316BEA] dark:text-cyan-400 shrink-0" />
                <span className="hidden xl:inline">Outline</span>
              </button>
            )}

            {/* Print Preview Button */}
            {onOpenPrintPreview && (
              <button
                onClick={onOpenPrintPreview}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-[#F2EFE9] dark:bg-slate-900 dark:hover:bg-slate-800 text-[#0B1F3A] dark:text-slate-300 border-[#D8D2C4] dark:border-slate-700/80 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0"
                title="Open Sandboxed A4 Print Preview to inspect layout, spacing & page breaks"
              >
                <Eye className="w-3.5 h-3.5 text-[#316BEA] dark:text-cyan-400 shrink-0" />
                <span>Preview</span>
              </button>
            )}

            {/* Export PDF Download Button - High Visibility & Prominence */}
            {onOpenPdfExport && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenPdfExport}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-[#159A68] via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold shadow-xs border border-emerald-400/40 transition-all cursor-pointer shrink-0"
                title="Download Strategy Memo as PDF (Press 'D' or Click)"
              >
                <FileDown className="w-3.5 h-3.5 text-emerald-100 shrink-0" />
                <span className="inline">Download PDF</span>
                <span className="hidden xl:inline-block px-1 py-0.2 bg-black/20 rounded text-[9px] font-mono text-emerald-100 ml-0.5 border border-emerald-300/30">
                  D
                </span>
              </motion.button>
            )}

            {/* Reading Depth Pill Switcher */}
            <div className="bg-[#EAE5D9] dark:bg-slate-950 border border-[#D8D2C4] dark:border-slate-700/80 p-0.5 rounded-lg flex items-center text-xs shrink-0">
              <button
                onClick={() => setReadingDepth('30s')}
                className={`px-1.5 sm:px-2 py-1 rounded font-semibold text-[11px] sm:text-xs transition-all cursor-pointer ${
                  readingDepth === '30s'
                    ? 'bg-[#316BEA] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-400 hover:text-[#0B1F3A] dark:hover:text-slate-200'
                }`}
                title="30-second executive summary mode"
              >
                30s
              </button>
              <button
                onClick={() => setReadingDepth('2m')}
                className={`px-1.5 sm:px-2 py-1 rounded font-semibold text-[11px] sm:text-xs transition-all cursor-pointer ${
                  readingDepth === '2m'
                    ? 'bg-[#316BEA] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-400 hover:text-[#0B1F3A] dark:hover:text-slate-200'
                }`}
                title="2-minute core product strategy"
              >
                2m
              </button>
              <button
                onClick={() => setReadingDepth('7m')}
                className={`px-1.5 sm:px-2 py-1 rounded font-semibold text-[11px] sm:text-xs transition-all cursor-pointer ${
                  readingDepth === '7m'
                    ? 'bg-[#316BEA] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-400 hover:text-[#0B1F3A] dark:hover:text-slate-200'
                }`}
                title="7-minute comprehensive technical memo"
              >
                7m
              </button>
            </div>

            {/* Theme Toggle Button with Smooth Sun-to-Moon Transition */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={toggleTheme}
              className="relative px-2 sm:px-2.5 py-1.5 text-[#0B1F3A] dark:text-slate-300 hover:text-black dark:hover:text-white bg-white dark:bg-slate-950/90 hover:bg-[#F2EFE9] dark:hover:bg-slate-800 border border-[#D8D2C4] dark:border-slate-700/80 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 group shadow-xs overflow-hidden shrink-0"
              title={getThemeTitle()}
              aria-label={getThemeTitle()}
            >
              {/* Dynamic Theme Glow Underlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
                animate={{
                  background: themeMode === 'light'
                    ? 'radial-gradient(circle at center, rgba(251, 191, 36, 0.35) 0%, transparent 70%)'
                    : 'radial-gradient(circle at center, rgba(37, 195, 255, 0.35) 0%, transparent 70%)'
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Animated Sun / Moon Icon Container */}
              <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
                <AnimatePresence mode="wait" initial={false}>
                  {themeMode === 'light' ? (
                    <motion.div
                      key="theme-sun"
                      initial={{ rotate: -90, scale: 0.3, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: 90, scale: 0.3, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 22,
                        mass: 0.6
                      }}
                      className="absolute inset-0 flex items-center justify-center text-amber-500"
                    >
                      <Sun className="w-4 h-4 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="theme-moon"
                      initial={{ rotate: 90, scale: 0.3, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: 90, scale: 0.3, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 22,
                        mass: 0.6
                      }}
                      className="absolute inset-0 flex items-center justify-center text-[#25C3FF]"
                    >
                      <Moon className="w-4 h-4 drop-shadow-[0_0_6px_rgba(37,195,255,0.6)]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Animated Label */}
              <div className="relative overflow-hidden hidden xl:block h-4 w-9 text-left">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={themeMode}
                    initial={{ y: themeMode === 'light' ? -14 : 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: themeMode === 'light' ? 14 : -14, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className={`block text-[11px] font-semibold tracking-wide ${
                      themeMode === 'light' 
                        ? 'text-amber-700 dark:text-amber-300' 
                        : 'text-cyan-300 group-hover:text-cyan-200'
                    }`}
                  >
                    {themeMode === 'light' ? 'Light' : 'Dark'}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.button>

            {/* Quick Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-[#0B1F3A] dark:hover:text-white hover:bg-[#EAE5D9] dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Search sections (Cmd+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Section Counter Badge */}
            <div className="hidden 2xl:flex items-center gap-1.5 px-2 py-1 bg-[#EAE5D9] dark:bg-slate-950 border border-[#D8D2C4] dark:border-slate-700/80 rounded-md font-mono text-xs text-slate-700 dark:text-slate-300 shrink-0">
              <span className="text-[#316BEA] dark:text-[#60A5FA] font-bold">{displayIndex}</span>
              <span className="text-slate-400 dark:text-slate-600">/</span>
              <span className="text-slate-500 dark:text-slate-400">{totalSections}</span>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-[#0B1F3A] dark:hover:text-white hover:bg-[#EAE5D9] dark:hover:bg-slate-800 rounded-lg cursor-pointer shrink-0"
              title="Toggle Sections Menu"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-[#E2DDD0] dark:border-slate-800 bg-[#FAF9F5] dark:bg-[#070D18] px-4 py-3 max-h-96 overflow-y-auto animate-in slide-in-from-top-2 duration-150 transition-colors">
            <div className="grid grid-cols-2 gap-1.5">
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`text-left px-3 py-2 rounded text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    activeSection === sec.id
                      ? 'bg-[#316BEA] text-white font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-[#EAE5D9] dark:hover:bg-slate-800 hover:text-[#0B1F3A] dark:hover:text-white'
                  }`}
                >
                  <span className="truncate">{sec.shortTitle}</span>
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{sec.num}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Reading Depth Banner */}
      <div className="bg-white/85 dark:bg-slate-900/90 border border-[#DEB6C5]/50 dark:border-slate-800 py-2 px-3 sm:px-4 text-xs text-[#0B1F3A] dark:text-slate-200 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 max-w-7xl mx-auto rounded-b-xl mb-4 shadow-xs backdrop-blur-xs transition-colors">
        <div className="flex items-center gap-2 min-w-0">
          <Clock className="w-3.5 h-3.5 text-[#D190AC] dark:text-[#25C3FF] shrink-0" />
          <span className="truncate sm:whitespace-normal">
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
            {readingDepth === '30s' && 'Executive takeaways, problem diagnosis, core bet, and decision rule.'}
            {readingDepth === '2m' && 'Full hypotheses, interactive prototypes, validation gates, and experiment design.'}
            {readingDepth === '7m' && 'Comprehensive mode: architectural flows, code acceptance criteria, and RACI.'}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">↑ / ↓</span>
            <span>jump sections</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">D</span>
            <span>PDF</span>
          </div>
          <button
            onClick={() => setReadingDepth(readingDepth === '7m' ? '30s' : readingDepth === '30s' ? '2m' : '7m')}
            className="text-[#316BEA] dark:text-blue-400 hover:underline font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            Toggle depth <ChevronRight className="w-3 h-3" />
          </button>
        </div>
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

