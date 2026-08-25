import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Home, 
  Compass, 
  AlertTriangle, 
  GitBranch, 
  Sliders, 
  ShieldCheck, 
  RotateCcw, 
  Smartphone, 
  FileText, 
  Network, 
  BarChart3, 
  Calculator, 
  Users, 
  CheckCircle2,
  BookmarkCheck,
  type LucideIcon
} from 'lucide-react';

interface BreadcrumbTrailProps {
  activeSection: string;
  onNavigateSection: (id: string) => void;
  isHighlighted?: boolean;
  onToggleHighlight?: (id: string) => void;
}

interface SectionInfo {
  id: string;
  num: string;
  title: string;
  shortTitle: string;
  category: string;
  icon: LucideIcon;
}

const SECTION_MAP: Record<string, SectionInfo> = {
  'hero': {
    id: 'hero',
    num: '00',
    title: 'Executive Overview & Strategic Mandate',
    shortTitle: 'Executive Brief',
    category: 'Strategic Mandate',
    icon: Compass
  },
  'problem': {
    id: 'problem',
    num: '01',
    title: 'The Leakage Problem: Existing-User Drop-off',
    shortTitle: 'Leakage Problem',
    category: 'Discovery & Diagnosis',
    icon: AlertTriangle
  },
  'hypotheses': {
    id: 'hypotheses',
    num: '02',
    title: 'Competing Hypotheses & Core Bet',
    shortTitle: 'Hypotheses',
    category: 'Strategic Alternatives',
    icon: GitBranch
  },
  'prioritization': {
    id: 'prioritization',
    num: '03',
    title: 'Strategic Prioritization Framework',
    shortTitle: 'Prioritization',
    category: 'Scoring & Trade-offs',
    icon: Sliders
  },
  'validation': {
    id: 'validation',
    num: '04',
    title: 'Stage-Gated Validation Protocol',
    shortTitle: 'Validation Gates',
    category: 'Risk Mitigation',
    icon: ShieldCheck
  },
  'mind-change': {
    id: 'mind-change',
    num: '05',
    title: 'Falsification & What Changes My Mind',
    shortTitle: 'Falsification',
    category: 'Conviction & Bounds',
    icon: RotateCcw
  },
  'intent-router': {
    id: 'intent-router',
    num: '06',
    title: 'Interactive Intent Router Prototype',
    shortTitle: 'Router Prototype',
    category: 'Product Experience',
    icon: Smartphone
  },
  'product-spec': {
    id: 'product-spec',
    num: '07',
    title: 'Product Specification & UX Flows',
    shortTitle: 'PRD & Spec',
    category: 'Product Architecture',
    icon: FileText
  },
  'architecture': {
    id: 'architecture',
    num: '08',
    title: 'Client-Side Architecture & Privacy Engine',
    shortTitle: 'System Architecture',
    category: 'Engineering & Privacy',
    icon: Network
  },
  'measurement': {
    id: 'measurement',
    num: '09',
    title: 'Incrementality & ITT Measurement Framework',
    shortTitle: 'Measurement & ITT',
    category: 'Economics & Metrics',
    icon: BarChart3
  },
  'simulator': {
    id: 'simulator',
    num: '10',
    title: 'Financial Sensitivity & ROI Simulator',
    shortTitle: 'ROI Model',
    category: 'Economics & ROI',
    icon: Calculator
  },
  'operating-model': {
    id: 'operating-model',
    num: '11',
    title: 'Operating Model, RACI & Sprint Rhythm',
    shortTitle: 'Operating Model',
    category: 'Execution & RACI',
    icon: Users
  },
  'decision': {
    id: 'decision',
    num: '12',
    title: 'Final Investment Decision & Next Steps',
    shortTitle: 'Investment Decision',
    category: 'Final Synthesis',
    icon: CheckCircle2
  }
};

const SECTION_ORDER = [
  'hero', 'problem', 'hypotheses', 'prioritization', 'validation',
  'mind-change', 'intent-router', 'product-spec', 'architecture',
  'measurement', 'simulator', 'operating-model', 'decision'
];

export const BreadcrumbTrail: React.FC<BreadcrumbTrailProps> = ({
  activeSection,
  onNavigateSection,
  isHighlighted = false,
  onToggleHighlight
}) => {
  const currentSection = SECTION_MAP[activeSection] || SECTION_MAP['hero'];
  const SectionIcon = currentSection.icon;

  const currentIndex = SECTION_ORDER.indexOf(activeSection);
  const prevSectionId = currentIndex > 0 ? SECTION_ORDER[currentIndex - 1] : null;
  const nextSectionId = currentIndex < SECTION_ORDER.length - 1 ? SECTION_ORDER[currentIndex + 1] : null;

  return (
    <nav 
      aria-label="Document Breadcrumb"
      className="sticky top-16 z-30 bg-[#F7F6ED]/95 dark:bg-[#050E1A]/95 backdrop-blur-md border-b border-[#DEB6C5]/50 dark:border-slate-800/80 transition-colors no-print px-2.5 sm:px-6 lg:px-8 py-2"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs">
        
        {/* Left: Trail items */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-0.5 min-w-0">
          
          {/* Root Link */}
          <button
            onClick={() => onNavigateSection('hero')}
            className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-[#8F3760] dark:hover:text-cyan-400 font-medium transition-colors shrink-0 cursor-pointer"
            title="Jump to Top / Executive Brief"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Dossier</span>
          </button>

          <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600 shrink-0" />

          {/* Category Chip */}
          <span className="hidden sm:inline text-slate-500 dark:text-slate-400 font-medium shrink-0">
            {currentSection.category}
          </span>

          <ChevronRight className="hidden sm:inline w-3 h-3 text-slate-400 dark:text-slate-600 shrink-0" />

          {/* Active Section Indicator with Smooth Flip Transition */}
          <div className="flex items-center gap-1.5 shrink-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-900/80 border border-[#DEB6C5]/70 dark:border-slate-700/60 px-2.5 py-1 rounded-full shadow-2xs"
              >
                <div className="w-4 h-4 rounded-full bg-[#D190AC]/20 dark:bg-cyan-500/20 text-[#8F3760] dark:text-[#25C3FF] flex items-center justify-center">
                  <SectionIcon className="w-2.5 h-2.5" />
                </div>

                <span className="font-mono font-bold text-[10px] text-[#8F3760] dark:text-cyan-400">
                  §{currentSection.num}
                </span>

                <span className="font-bold text-slate-900 dark:text-white max-w-[140px] xs:max-w-[220px] md:max-w-none truncate">
                  <span className="hidden md:inline">{currentSection.title}</span>
                  <span className="md:hidden">{currentSection.shortTitle}</span>
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Quick Previous / Next Navigation Arrows */}
        <div className="flex items-center gap-1 shrink-0">
          {prevSectionId && (
            <button
              onClick={() => onNavigateSection(prevSectionId)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-[#DEB6C5]/30 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={`Previous Section: ${SECTION_MAP[prevSectionId]?.shortTitle}`}
              aria-label="Previous Section"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 px-1 hidden sm:inline">
            {currentIndex + 1} / {SECTION_ORDER.length}
          </div>

          {nextSectionId && (
            <button
              onClick={() => onNavigateSection(nextSectionId)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-[#DEB6C5]/30 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={`Next Section: ${SECTION_MAP[nextSectionId]?.shortTitle}`}
              aria-label="Next Section"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};
