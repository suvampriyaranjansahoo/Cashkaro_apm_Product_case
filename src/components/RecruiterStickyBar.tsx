import React, { useState } from 'react';
import { 
  Award, 
  FileText, 
  Smartphone, 
  TrendingUp, 
  Mail, 
  Check, 
  Copy, 
  ChevronUp, 
  ChevronDown,
  Sparkles,
  UserCheck,
  FileDown,
  Eye,
  ListOrdered
} from 'lucide-react';

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
  const [collapsed, setCollapsed] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('sahoosuvampriyaranjan10@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[94%] sm:w-auto transition-all duration-200">
      <div className="bg-[#0B1728]/95 backdrop-blur-md text-white rounded-2xl border border-slate-700/80 shadow-2xl p-2 sm:p-2.5 flex items-center justify-between gap-2 sm:gap-3">
        
        {/* Candidate Chip */}
        <div className="flex items-center gap-2.5 pl-2 pr-1">
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
          
          {/* Recruiter Evaluation Hub (Primary highlight) */}
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

        </div>

      </div>
    </div>
  );
};
