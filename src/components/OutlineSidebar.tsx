import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SECTIONS } from '../data/caseData';
import { ReadingDepth } from '../types';
import { 
  ListOrdered, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  X, 
  Bookmark, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Sliders, 
  ShieldCheck, 
  GitBranch, 
  BarChart3, 
  Calculator, 
  Users, 
  Award, 
  HelpCircle,
  Clock,
  ArrowUpRight,
  Filter,
  Eye,
  ChevronDown,
  Hourglass
} from 'lucide-react';

interface OutlineSidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
  highlightedSections: string[];
  onToggleHighlight: (sectionId: string) => void;
  readingDepth: ReadingDepth;
  onOpen1Pager: () => void;
  onOpenRecruiterHub?: () => void;
  onOpenPrintPreview?: () => void;
}

type OutlineCategoryFilter = 'all' | 'strategic' | 'technical' | 'economics' | 'saved';

// Category mapping with icons and baseline character counts for initial render
const SECTION_METAS: Record<string, { category: 'strategic' | 'technical' | 'economics'; baselineChars: number; icon: any }> = {
  'hero': { category: 'strategic', baselineChars: 1400, icon: Award },
  'problem': { category: 'strategic', baselineChars: 2100, icon: HelpCircle },
  'hypotheses': { category: 'strategic', baselineChars: 2400, icon: GitBranch },
  'prioritization': { category: 'strategic', baselineChars: 2200, icon: Sliders },
  'validation': { category: 'strategic', baselineChars: 2600, icon: ShieldCheck },
  'mind-change': { category: 'strategic', baselineChars: 1500, icon: HelpCircle },
  'intent-router': { category: 'technical', baselineChars: 2300, icon: Sparkles },
  'product-spec': { category: 'technical', baselineChars: 3600, icon: FileText },
  'architecture': { category: 'technical', baselineChars: 2500, icon: GitBranch },
  'measurement': { category: 'economics', baselineChars: 2400, icon: BarChart3 },
  'simulator': { category: 'economics', baselineChars: 2300, icon: Calculator },
  'operating-model': { category: 'technical', baselineChars: 2400, icon: Users },
  'final-decision': { category: 'strategic', baselineChars: 1400, icon: CheckCircle2 },
};

/**
 * Calculates estimated reading time based on character count.
 * Technical & strategic product memos typically have an average reading pace of ~950-1,000 characters/minute.
 */
export const calculateReadingTimeFromChars = (charCount: number) => {
  const charsPerMinute = 950;
  const mins = Math.max(1, Math.round(charCount / charsPerMinute));
  return {
    mins,
    formatted: `${mins}m`,
    chars: charCount,
    charLabel: charCount >= 1000 ? `${(charCount / 1000).toFixed(1)}k chars` : `${charCount} chars`,
  };
};

export const OutlineSidebar: React.FC<OutlineSidebarProps> = ({
  isOpen,
  setIsOpen,
  activeSection,
  onNavigateSection,
  highlightedSections,
  onToggleHighlight,
  readingDepth,
  onOpen1Pager,
  onOpenRecruiterHub,
  onOpenPrintPreview,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<OutlineCategoryFilter>('all');
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);
  const activeItemRef = useRef<HTMLButtonElement | null>(null);
  const listContainerRef = useRef<HTMLDivElement | null>(null);

  // Dynamic state for character counts extracted directly from DOM
  const [sectionCharCounts, setSectionCharCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    Object.keys(SECTION_METAS).forEach((key) => {
      initial[key] = SECTION_METAS[key].baselineChars;
    });
    return initial;
  });

  // Dynamically measure actual DOM character counts per section
  useEffect(() => {
    const measureDomCharacters = () => {
      const counts: Record<string, number> = {};
      SECTIONS.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (el) {
          const text = el.innerText || '';
          const cleanLength = text.replace(/\s+/g, ' ').trim().length;
          if (cleanLength > 100) {
            counts[sec.id] = cleanLength;
          }
        }
      });
      if (Object.keys(counts).length > 0) {
        setSectionCharCounts((prev) => ({ ...prev, ...counts }));
      }
    };

    // Trigger after DOM rendering / readingDepth toggle
    const timer = setTimeout(measureDomCharacters, 400);
    window.addEventListener('resize', measureDomCharacters);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measureDomCharacters);
    };
  }, [readingDepth]);

  // Save expanded state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('outline_sidebar_open', String(isOpen));
    } catch (e) {
      console.error(e);
    }
  }, [isOpen]);

  // Global keyboard shortcut to toggle outline (Alt+O or Ctrl+O)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey || e.ctrlKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Calculate document scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollPercentage(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter sections by search and category
  const filteredSections = useMemo(() => {
    return SECTIONS.filter((sec) => {
      const meta = SECTION_METAS[sec.id] || { category: 'strategic' };
      
      // Category filter check
      if (categoryFilter === 'saved' && !highlightedSections.includes(sec.id)) {
        return false;
      }
      if (categoryFilter === 'strategic' && meta.category !== 'strategic') {
        return false;
      }
      if (categoryFilter === 'technical' && meta.category !== 'technical') {
        return false;
      }
      if (categoryFilter === 'economics' && meta.category !== 'economics') {
        return false;
      }

      // Search query check
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        sec.title.toLowerCase().includes(query) ||
        sec.shortTitle.toLowerCase().includes(query) ||
        sec.summary30s.toLowerCase().includes(query) ||
        sec.num.includes(query) ||
        meta.category.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, categoryFilter, highlightedSections]);

  // Total document reading time
  const totalDocumentReadingMins = useMemo(() => {
    return SECTIONS.reduce((acc, sec) => {
      const chars = sectionCharCounts[sec.id] || SECTION_METAS[sec.id]?.baselineChars || 2000;
      return acc + calculateReadingTimeFromChars(chars).mins;
    }, 0);
  }, [sectionCharCounts]);

  // Category aggregate reading times
  const categoryReadingTimes = useMemo(() => {
    const times = {
      strategic: 0,
      technical: 0,
      economics: 0,
      saved: 0,
    };
    SECTIONS.forEach((sec) => {
      const meta = SECTION_METAS[sec.id];
      const chars = sectionCharCounts[sec.id] || meta?.baselineChars || 2000;
      const mins = calculateReadingTimeFromChars(chars).mins;
      if (meta?.category) {
        times[meta.category] += mins;
      }
      if (highlightedSections.includes(sec.id)) {
        times.saved += mins;
      }
    });
    return times;
  }, [sectionCharCounts, highlightedSections]);

  const activeIndex = SECTIONS.findIndex((s) => s.id === activeSection);
  const currentSectionMeta = SECTIONS[activeIndex] || SECTIONS[0];
  const currentCharCount = sectionCharCounts[currentSectionMeta.id] || SECTION_METAS[currentSectionMeta.id]?.baselineChars || 2000;
  const currentReadTime = calculateReadingTimeFromChars(currentCharCount);

  // Calculate remaining estimated review time from current section onwards
  const remainingReadingMins = useMemo(() => {
    if (activeIndex < 0) return totalDocumentReadingMins;
    return SECTIONS.slice(activeIndex).reduce((acc, sec) => {
      const chars = sectionCharCounts[sec.id] || SECTION_METAS[sec.id]?.baselineChars || 2000;
      return acc + calculateReadingTimeFromChars(chars).mins;
    }, 0);
  }, [activeIndex, sectionCharCounts, totalDocumentReadingMins]);

  const handleSelectSection = (sectionId: string) => {
    onNavigateSection(sectionId);
    // On small screens, auto-collapse sidebar on selection
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <aside 
      id="outline-sidebar-wrapper"
      className="no-print z-40"
      aria-label="Document Outline and Navigation Sidebar"
    >
      {/* Floating Toggle Button (Visible when sidebar is collapsed) */}
      {!isOpen && (
        <div className="fixed left-3 top-24 sm:top-28 z-40 flex flex-col gap-2">
          <button
            id="outline-expand-trigger"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-[#0E1726] hover:bg-[#F0EAD5] dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-[#DEB6C5]/70 dark:border-slate-700/80 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer hover:border-[#D190AC] dark:hover:border-blue-500"
            title="Open Document Outline Sidebar (Shortcut: Alt+O)"
          >
            <div className="w-6 h-6 rounded-lg bg-[#D190AC]/20 dark:bg-blue-950/60 text-[#8F3760] dark:text-blue-400 flex items-center justify-center font-mono text-[11px] font-bold">
              {String(activeIndex + 1).padStart(2, '0')}
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <ListOrdered className="w-3.5 h-3.5 text-[#8F3760] dark:text-[#316BEA]" />
                <span className="text-xs font-bold font-display tracking-tight text-slate-900 dark:text-white">
                  Outline
                </span>
                <span className="text-[10px] font-mono bg-[#F0EAD5] dark:bg-blue-950/80 text-[#8F3760] dark:text-blue-300 px-1 py-0.2 rounded border border-[#DEB6C5]/70 dark:border-blue-900/50 flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  {currentReadTime.formatted}
                </span>
              </div>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 max-w-[120px] truncate font-medium">
                {currentSectionMeta.shortTitle}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#8F3760] dark:group-hover:text-[#316BEA] group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      )}

      {/* Backdrop for Mobile / Tablet Screen Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Expandable Sidebar Panel */}
      <div 
        id="outline-sidebar-panel"
        className={`fixed top-16 bottom-0 left-0 z-40 w-80 sm:w-96 bg-[#FDFBF7] dark:bg-[#0A111E] border-r border-[#DEB6C5]/70 dark:border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Bar */}
        <div className="p-4 border-b border-[#DEB6C5]/60 dark:border-slate-800/80 bg-[#F7F6ED] dark:bg-[#070D18] flex items-center justify-between shrink-0 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D190AC] to-[#8F3760] dark:from-[#316BEA] dark:to-blue-600 flex items-center justify-center text-white shadow-xs">
              <ListOrdered className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  Document Outline
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F0EAD5] dark:bg-blue-950/60 text-[#8F3760] dark:text-blue-400 font-bold border border-[#DEB6C5]/70 dark:border-blue-900/60">
                  {SECTIONS.length} Sections
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                <span className="flex items-center gap-1 font-mono font-semibold text-slate-800 dark:text-slate-300">
                  <Clock className="w-3 h-3 text-[#8F3760] dark:text-[#316BEA]" />
                  ~{totalDocumentReadingMins}m total read
                </span>
                <span>•</span>
                <span className="text-[10px]">Char-based pacing</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Close Outline Sidebar (Esc)"
              aria-label="Close Outline"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Progress & Pace Meter */}
        <div className="px-4 py-2.5 bg-white dark:bg-[#0E1726] border-b border-[#DEB6C5]/40 dark:border-slate-800/60 shrink-0 transition-colors">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Sec {String(activeIndex + 1).padStart(2, '0')}:
              </span>
              <span className="text-[#8F3760] dark:text-blue-400 font-medium truncate max-w-[110px]">
                {currentSectionMeta.shortTitle}
              </span>
              <span className="px-1.5 py-0.2 bg-[#F0EAD5] dark:bg-blue-950/60 text-[#8F3760] dark:text-blue-300 rounded text-[9px] font-bold">
                {currentReadTime.formatted}
              </span>
            </div>
            <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-300">
              <span>{Math.round(scrollPercentage)}%</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">({remainingReadingMins}m left)</span>
            </div>
          </div>
          <div className="w-full bg-[#F0EAD5] dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#D190AC] to-[#8F3760] dark:from-[#316BEA] dark:to-[#159A68] h-full transition-all duration-150 rounded-full"
              style={{ width: `${scrollPercentage}%` }}
            />
          </div>
        </div>

        {/* Search & Topic Filters */}
        <div className="p-3.5 border-b border-[#DEB6C5]/40 dark:border-slate-800 bg-[#F7F6ED]/70 dark:bg-[#070D18] space-y-2.5 shrink-0 transition-colors">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="outline-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sections, PRD, metrics, gates..."
              className="w-full pl-8 pr-7 py-1.5 bg-white dark:bg-slate-900 border border-[#DEB6C5]/70 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#D190AC] dark:focus:ring-[#316BEA] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills with Reading Times */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] scrollbar-none">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-[#D190AC] dark:bg-[#0080AB] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-[#DEB6C5]/60 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({totalDocumentReadingMins}m)
            </button>

            <button
              onClick={() => setCategoryFilter('strategic')}
              className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === 'strategic'
                  ? 'bg-[#D190AC] dark:bg-[#0080AB] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-[#DEB6C5]/60 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Strategy ({categoryReadingTimes.strategic}m)
            </button>

            <button
              onClick={() => setCategoryFilter('technical')}
              className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === 'technical'
                  ? 'bg-[#D190AC] dark:bg-[#0080AB] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-[#DEB6C5]/60 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tech ({categoryReadingTimes.technical}m)
            </button>

            <button
              onClick={() => setCategoryFilter('economics')}
              className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === 'economics'
                  ? 'bg-[#D190AC] dark:bg-[#0080AB] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-[#DEB6C5]/60 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Econ ({categoryReadingTimes.economics}m)
            </button>

            {highlightedSections.length > 0 && (
              <button
                onClick={() => setCategoryFilter('saved')}
                className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                  categoryFilter === 'saved'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60'
                }`}
              >
                <Bookmark className="w-2.5 h-2.5 fill-current" />
                <span>Saved ({categoryReadingTimes.saved}m)</span>
              </button>
            )}
          </div>

        </div>

        {/* Section List Scrollable Body */}
        <div 
          ref={listContainerRef}
          className="flex-1 overflow-y-auto p-3 space-y-1.5 focus:outline-none"
        >
          {filteredSections.length === 0 ? (
            <div className="p-6 text-center text-slate-400 dark:text-slate-500 text-xs">
              <Filter className="w-6 h-6 mx-auto mb-2 opacity-50" />
              No sections match the current filter or search query.
            </div>
          ) : (
            filteredSections.map((sec, idx) => {
              const isCurrent = sec.id === activeSection;
              const isMarked = highlightedSections.includes(sec.id);
              const meta = SECTION_METAS[sec.id] || { category: 'strategic', baselineChars: 2000, icon: FileText };
              const charCount = sectionCharCounts[sec.id] || meta.baselineChars;
              const readTimeInfo = calculateReadingTimeFromChars(charCount);

              return (
                <div
                  key={sec.id}
                  className={`group relative rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-[#F0EAD5] dark:bg-blue-950/40 border-[#D190AC] dark:border-blue-500/60 shadow-xs'
                      : 'bg-white dark:bg-[#0E1726] border-[#DEB6C5]/50 dark:border-slate-800/80 hover:border-[#D190AC]/70 dark:hover:border-slate-700 hover:bg-[#F7F6ED] dark:hover:bg-slate-800/50'
                  }`}
                >
                  <button
                    ref={isCurrent ? activeItemRef : null}
                    onClick={() => handleSelectSection(sec.id)}
                    className="w-full text-left p-2.5 pr-8 flex items-start gap-2.5 cursor-pointer"
                  >
                    {/* Number Tag */}
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-[10px] font-bold shrink-0 transition-colors ${
                      isCurrent
                        ? 'bg-[#D190AC] dark:bg-[#0080AB] text-white shadow-xs'
                        : 'bg-[#F0EAD5]/70 dark:bg-slate-800 text-slate-700 dark:text-slate-400 group-hover:bg-[#F0EAD5] dark:group-hover:bg-slate-700 group-hover:text-[#8F3760]'
                    }`}>
                      {sec.num}
                    </div>

                    {/* Section Information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={`text-xs font-bold truncate ${
                          isCurrent 
                            ? 'text-[#0B1F3A] dark:text-white font-display' 
                            : 'text-slate-800 dark:text-slate-200 group-hover:text-[#8F3760] dark:group-hover:text-blue-400'
                        }`}>
                          {sec.title}
                        </span>
                      </div>

                      {/* Summary Excerpt */}
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                        {sec.summary30s}
                      </p>

                      {/* Read time and Category Badge */}
                      <div className="flex items-center gap-1.5 mt-1.5 text-[9px] font-mono">
                        {/* Prominent Estimated Read Time Tag */}
                        <span 
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-bold border transition-colors ${
                            isCurrent
                              ? 'bg-[#D190AC] dark:bg-[#0080AB] text-white border-[#D190AC] dark:border-[#0080AB]'
                              : 'bg-[#F0EAD5]/60 dark:bg-blue-950/70 text-[#8F3760] dark:text-blue-300 border-[#DEB6C5]/60 dark:border-blue-900/60 group-hover:bg-[#F0EAD5]'
                          }`}
                          title={`Estimated reading time: ${readTimeInfo.formatted} based on ~${readTimeInfo.chars.toLocaleString()} characters`}
                        >
                          <Clock className="w-2.5 h-2.5" />
                          <span>{readTimeInfo.formatted}</span>
                        </span>

                        <span className="text-slate-500 dark:text-slate-500">
                          (~{readTimeInfo.charLabel})
                        </span>

                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="uppercase tracking-wider text-slate-500 dark:text-slate-500">
                          {meta.category}
                        </span>

                        {isCurrent && (
                          <>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span className="text-[#8F3760] dark:text-blue-400 font-bold">ACTIVE</span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Bookmark Button in Outline */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleHighlight(sec.id);
                    }}
                    className={`absolute right-2 top-2.5 p-1 rounded-md transition-colors cursor-pointer ${
                      isMarked 
                        ? 'text-amber-500 hover:text-amber-600 dark:text-amber-400' 
                        : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400'
                    }`}
                    title={isMarked ? 'Remove bookmark' : 'Bookmark this section for recruiter report'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-current' : ''}`} />
                  </button>

                </div>
              );
            })
          )}
        </div>

        {/* Recruiter Quick Deep Dive Jump Links (Bottom Footer) */}
        <div className="p-3 bg-[#F7F6ED] dark:bg-[#070D18] border-t border-[#DEB6C5]/60 dark:border-slate-800 shrink-0 space-y-2 transition-colors">
          
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-between">
            <span>Recruiter Quick Jumps</span>
            <span className="text-slate-400">Press Alt+O to toggle</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handleSelectSection('product-spec')}
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-[#DEB6C5]/60 dark:border-slate-800 text-[11px] font-semibold text-slate-800 dark:text-slate-300 hover:text-[#8F3760] dark:hover:text-blue-400 hover:border-[#D190AC] transition-colors text-left flex items-center justify-between cursor-pointer"
            >
              <span>PRD Specs ({calculateReadingTimeFromChars(sectionCharCounts['product-spec'] || 3600).formatted})</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </button>

            <button
              onClick={() => handleSelectSection('validation')}
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-[#DEB6C5]/60 dark:border-slate-800 text-[11px] font-semibold text-slate-800 dark:text-slate-300 hover:text-[#8F3760] dark:hover:text-blue-400 hover:border-[#D190AC] transition-colors text-left flex items-center justify-between cursor-pointer"
            >
              <span>4 Gates ({calculateReadingTimeFromChars(sectionCharCounts['validation'] || 2600).formatted})</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </button>

            <button
              onClick={() => handleSelectSection('measurement')}
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-[#DEB6C5]/60 dark:border-slate-800 text-[11px] font-semibold text-slate-800 dark:text-slate-300 hover:text-[#8F3760] dark:hover:text-blue-400 hover:border-[#D190AC] transition-colors text-left flex items-center justify-between cursor-pointer"
            >
              <span>50/50 ITT ({calculateReadingTimeFromChars(sectionCharCounts['measurement'] || 2400).formatted})</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </button>

            <button
              onClick={() => handleSelectSection('simulator')}
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-[#DEB6C5]/60 dark:border-slate-800 text-[11px] font-semibold text-slate-800 dark:text-slate-300 hover:text-[#8F3760] dark:hover:text-blue-400 hover:border-[#D190AC] transition-colors text-left flex items-center justify-between cursor-pointer"
            >
              <span>Financial ({calculateReadingTimeFromChars(sectionCharCounts['simulator'] || 2300).formatted})</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <button
              onClick={onOpen1Pager}
              className="flex-1 py-1.5 bg-[#D190AC] dark:bg-[#0080AB] hover:bg-[#8F3760] dark:hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Executive 1-Pager</span>
            </button>

            {onOpenPrintPreview && (
              <button
                onClick={onOpenPrintPreview}
                className="px-2.5 py-1.5 bg-[#F0EAD5] dark:bg-slate-800 hover:bg-[#DEB6C5]/50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-[#DEB6C5]/60 dark:border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="A4 Print Preview"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Preview</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </aside>
  );
};

