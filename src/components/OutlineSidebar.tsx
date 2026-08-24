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
  ChevronDown
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

// Category mapping for quick filtering
const SECTION_CATEGORIES: Record<string, { category: 'strategic' | 'technical' | 'economics'; readTime: string; icon: any }> = {
  'hero': { category: 'strategic', readTime: '1m', icon: Award },
  'problem': { category: 'strategic', readTime: '2m', icon: HelpCircle },
  'hypotheses': { category: 'strategic', readTime: '2m', icon: GitBranch },
  'prioritization': { category: 'strategic', readTime: '2m', icon: Sliders },
  'validation': { category: 'strategic', readTime: '2m', icon: ShieldCheck },
  'mind-change': { category: 'strategic', readTime: '1m', icon: HelpCircle },
  'intent-router': { category: 'technical', readTime: '2m', icon: Sparkles },
  'product-spec': { category: 'technical', readTime: '3m', icon: FileText },
  'architecture': { category: 'technical', readTime: '2m', icon: GitBranch },
  'measurement': { category: 'economics', readTime: '2m', icon: BarChart3 },
  'simulator': { category: 'economics', readTime: '2m', icon: Calculator },
  'operating-model': { category: 'technical', readTime: '2m', icon: Users },
  'final-decision': { category: 'strategic', readTime: '1m', icon: CheckCircle2 },
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
      const meta = SECTION_CATEGORIES[sec.id] || { category: 'strategic' };
      
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

  const activeIndex = SECTIONS.findIndex((s) => s.id === activeSection);
  const currentSectionMeta = SECTIONS[activeIndex] || SECTIONS[0];

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
            className="group flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-[#0E1726] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer hover:border-[#316BEA] dark:hover:border-blue-500"
            title="Open Document Outline Sidebar (Shortcut: Alt+O)"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#316BEA] dark:text-blue-400 flex items-center justify-center font-mono text-[11px] font-bold">
              {String(activeIndex + 1).padStart(2, '0')}
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <ListOrdered className="w-3.5 h-3.5 text-[#316BEA]" />
                <span className="text-xs font-bold font-display tracking-tight text-slate-900 dark:text-white">
                  Outline
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {activeIndex + 1}/{SECTIONS.length}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 max-w-[120px] truncate font-medium">
                {currentSectionMeta.shortTitle}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#316BEA] group-hover:translate-x-0.5 transition-all" />
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
        className={`fixed top-16 bottom-0 left-0 z-40 w-80 sm:w-96 bg-white dark:bg-[#0A111E] border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#070D18] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#316BEA] to-blue-600 flex items-center justify-center text-white shadow-xs">
              <ListOrdered className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  Document Outline
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#316BEA] dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-900/60">
                  {SECTIONS.length} Sections
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Non-linear recruiter strategic navigator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Collapse Outline Sidebar (Esc)"
              aria-label="Collapse Outline"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Progress Meter */}
        <div className="px-4 py-2.5 bg-white dark:bg-[#0E1726] border-b border-slate-100 dark:border-slate-800/60 shrink-0">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Current: Section {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-[#316BEA] dark:text-blue-400 font-medium truncate max-w-[140px]">
                {currentSectionMeta.shortTitle}
              </span>
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {Math.round(scrollPercentage)}%
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#316BEA] to-[#159A68] h-full transition-all duration-150 rounded-full"
              style={{ width: `${scrollPercentage}%` }}
            />
          </div>
        </div>

        {/* Search & Topic Filters */}
        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070D18] space-y-2.5 shrink-0">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="outline-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sections, PRD, metrics, gates..."
              className="w-full pl-8 pr-7 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#316BEA] transition-all"
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

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] scrollbar-none">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-[#316BEA] text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({SECTIONS.length})
            </button>

            <button
              onClick={() => setCategoryFilter('strategic')}
              className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === 'strategic'
                  ? 'bg-[#316BEA] text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Strategy
            </button>

            <button
              onClick={() => setCategoryFilter('technical')}
              className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === 'technical'
                  ? 'bg-[#316BEA] text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tech / PRD
            </button>

            <button
              onClick={() => setCategoryFilter('economics')}
              className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === 'economics'
                  ? 'bg-[#316BEA] text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Economics
            </button>

            {highlightedSections.length > 0 && (
              <button
                onClick={() => setCategoryFilter('saved')}
                className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                  categoryFilter === 'saved'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60'
                }`}
              >
                <Bookmark className="w-2.5 h-2.5 fill-current" />
                <span>Saved ({highlightedSections.length})</span>
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
              const meta = SECTION_CATEGORIES[sec.id] || { category: 'strategic', readTime: '2m', icon: FileText };
              const IconComp = meta.icon;

              return (
                <div
                  key={sec.id}
                  className={`group relative rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-[#316BEA]/60 dark:border-blue-500/60 shadow-xs'
                      : 'bg-white dark:bg-[#0E1726] border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <button
                    ref={isCurrent ? activeItemRef : null}
                    onClick={() => handleSelectSection(sec.id)}
                    className="w-full text-left p-2.5 pr-8 flex items-start gap-2.5 cursor-pointer"
                  >
                    {/* Number Tag & Icon */}
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-[10px] font-bold shrink-0 transition-colors ${
                      isCurrent
                        ? 'bg-[#316BEA] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-slate-700 group-hover:text-[#316BEA]'
                    }`}>
                      {sec.num}
                    </div>

                    {/* Section Information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={`text-xs font-bold truncate ${
                          isCurrent 
                            ? 'text-[#0B1F3A] dark:text-white font-display' 
                            : 'text-slate-800 dark:text-slate-200 group-hover:text-[#316BEA] dark:group-hover:text-blue-400'
                        }`}>
                          {sec.title}
                        </span>
                      </div>

                      {/* Summary Excerpt */}
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                        {sec.summary30s}
                      </p>

                      {/* Read time and Category Badge */}
                      <div className="flex items-center gap-2 mt-1.5 text-[9px] font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {meta.readTime}
                        </span>
                        <span>•</span>
                        <span className="uppercase tracking-wider">
                          {meta.category}
                        </span>
                        {isCurrent && (
                          <>
                            <span>•</span>
                            <span className="text-[#316BEA] dark:text-blue-400 font-bold">ACTIVE</span>
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
        <div className="p-3 bg-slate-50 dark:bg-[#070D18] border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2">
          
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
            <span>Recruiter Quick Jumps</span>
            <span className="text-slate-400">Press Alt+O to toggle</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handleSelectSection('product-spec')}
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-[#316BEA] dark:hover:text-blue-400 hover:border-blue-300 transition-colors text-left flex items-center justify-between cursor-pointer"
            >
              <span>PRD Specs (AC1-7)</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </button>

            <button
              onClick={() => handleSelectSection('validation')}
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-[#316BEA] dark:hover:text-blue-400 hover:border-blue-300 transition-colors text-left flex items-center justify-between cursor-pointer"
            >
              <span>4 Validation Gates</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </button>

            <button
              onClick={() => handleSelectSection('measurement')}
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-[#316BEA] dark:hover:text-blue-400 hover:border-blue-300 transition-colors text-left flex items-center justify-between cursor-pointer"
            >
              <span>50/50 ITT Framework</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </button>

            <button
              onClick={() => handleSelectSection('simulator')}
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-[#316BEA] dark:hover:text-blue-400 hover:border-blue-300 transition-colors text-left flex items-center justify-between cursor-pointer"
            >
              <span>Financial Model</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <button
              onClick={onOpen1Pager}
              className="flex-1 py-1.5 bg-[#316BEA] hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Executive 1-Pager</span>
            </button>

            {onOpenPrintPreview && (
              <button
                onClick={onOpenPrintPreview}
                className="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="A4 Print Preview"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-500" />
                <span>Preview</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </aside>
  );
};
