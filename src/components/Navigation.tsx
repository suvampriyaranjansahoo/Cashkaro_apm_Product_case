import React, { useState, useEffect } from 'react';
import { SECTIONS } from '../data/caseData';
import { ReadingDepth } from '../types';
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
  ArrowUpRight 
} from 'lucide-react';

interface NavigationProps {
  readingDepth: ReadingDepth;
  setReadingDepth: (depth: ReadingDepth) => void;
  activeSection: string;
  setActiveSection: (id: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  readingDepth,
  setReadingDepth,
  activeSection,
  setActiveSection,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);
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
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-slate-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#316BEA] to-[#159A68] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#0B1728]/95 backdrop-blur-md text-white border-b border-slate-800 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Case Tag */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => scrollToSection('hero')}
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#316BEA] flex items-center justify-center font-display font-bold text-sm tracking-tighter text-white shadow-sm group-hover:scale-105 transition-transform">
                CK
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] tracking-widest uppercase font-semibold text-slate-400">APM Case Memo</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#159A68]"></span>
                </div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                  CashKaro Intent Router
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Section Scroller */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none text-xs">
            {SECTIONS.slice(0, 8).map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`px-2.5 py-1.5 rounded-md transition-all font-medium whitespace-nowrap ${
                    isActive
                      ? 'bg-[#316BEA] text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {sec.shortTitle}
                </button>
              );
            })}
          </nav>

          {/* Depth Modes & Tools */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Reading Depth Pill Switcher */}
            <div className="bg-slate-900/90 border border-slate-700/70 p-0.5 rounded-lg flex items-center text-xs">
              <button
                onClick={() => setReadingDepth('30s')}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  readingDepth === '30s'
                    ? 'bg-[#316BEA] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="30-second executive summary mode"
              >
                30s
              </button>
              <button
                onClick={() => setReadingDepth('2m')}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  readingDepth === '2m'
                    ? 'bg-[#316BEA] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="2-minute core product strategy"
              >
                2m
              </button>
              <button
                onClick={() => setReadingDepth('7m')}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  readingDepth === '7m'
                    ? 'bg-[#316BEA] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="7-minute comprehensive technical memo"
              >
                7m
              </button>
            </div>

            {/* Quick Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Search sections (Cmd+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Print Button */}
            <button
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700/50 transition-colors"
              title="Print or Export Memo"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            {/* Section Counter Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-700/80 rounded-md font-mono text-xs text-slate-300">
              <span className="text-[#316BEA] font-bold">{displayIndex}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">{totalSections}</span>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-800 bg-[#0B1728] px-4 py-3 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-1.5">
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`text-left px-3 py-2 rounded text-xs flex items-center justify-between ${
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
      <div className="bg-[#EBF2FE] border-b border-[#D4E4FC] py-2 px-4 text-xs text-[#0B1F3A] flex items-center justify-between max-w-7xl mx-auto rounded-b-lg mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#316BEA] shrink-0" />
          <span>
            {readingDepth === '30s' && (
              <strong>30s Executive View Active:</strong>
            )}
            {readingDepth === '2m' && (
              <strong>2m PM Core View Active:</strong>
            )}
            {readingDepth === '7m' && (
              <strong>7m Full Investment Memo Active:</strong>
            )}
            {' '}
            {readingDepth === '30s' && 'Highlighting key executive takeaways, problem diagnosis, core bet, and decision rule.'}
            {readingDepth === '2m' && 'Displaying full hypotheses, product spec, validation gates, and experiment design.'}
            {readingDepth === '7m' && 'Comprehensive mode including architectural flows, code acceptance criteria, sensitivity formulas, and RACI.'}
          </span>
        </div>
        <button
          onClick={() => setReadingDepth(readingDepth === '7m' ? '30s' : readingDepth === '30s' ? '2m' : '7m')}
          className="text-[#316BEA] hover:underline font-medium shrink-0 ml-3 flex items-center gap-1"
        >
          Toggle depth <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3 border-b border-slate-100 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 ml-2" />
              <input
                type="text"
                placeholder="Jump to section, hypothesis, gate, or formula..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none py-1"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-start gap-3 group"
                >
                  <span className="font-mono text-xs font-semibold text-[#316BEA] bg-blue-50 px-1.5 py-0.5 rounded shrink-0">
                    {sec.num}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-[#316BEA]">
                      {sec.title}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {sec.summary30s}
                    </div>
                  </div>
                </button>
              ))}
              {filteredSections.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-500">
                  No matching sections found for "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
