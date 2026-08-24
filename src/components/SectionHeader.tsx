import React, { useState } from 'react';
import { Link2, Check, Star, Bookmark, Share2 } from 'lucide-react';

interface SectionHeaderProps {
  num: string;
  category: string;
  title: React.ReactNode;
  description: React.ReactNode;
  sectionId: string;
  isHighlighted?: boolean;
  onToggleHighlight?: (sectionId: string) => void;
  badge?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  num,
  category,
  title,
  description,
  sectionId,
  isHighlighted = false,
  onToggleHighlight,
  badge,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mb-8 group relative">
      {/* Category Ribbon & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#316BEA] dark:text-[#60A5FA] tracking-wider">
            <span>{num}</span>
            <span>/</span>
            <span>{category}</span>
          </div>
          {badge}
        </div>

        {/* Action Tools: Copy Direct Link & Recruiter Highlight */}
        <div className="flex items-center gap-2">
          {/* Highlight / Star for Recruiter Evaluation */}
          {onToggleHighlight && (
            <button
              onClick={() => onToggleHighlight(sectionId)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                isHighlighted
                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 shadow-xs'
                  : 'bg-white dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
              title={isHighlighted ? 'Remove highlight from evaluation list' : 'Highlight insight for interview review'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isHighlighted ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
              <span className="text-[11px] font-mono">
                {isHighlighted ? 'Highlighted' : 'Highlight'}
              </span>
            </button>
          )}

          {/* Copy Direct Section Link */}
          <button
            onClick={handleCopyLink}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
              copied
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                : 'bg-white dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
            title={`Copy direct link to section #${sectionId}`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px] font-mono font-semibold">Link Copied!</span>
              </>
            ) : (
              <>
                <Link2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#316BEA] transition-colors" />
                <span className="text-[11px] font-mono">Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Title */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-[#0B1F3A] dark:text-slate-50 tracking-tight leading-tight">
        {title}
      </h2>

      {/* Description / Subtitle */}
      <div className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
        {description}
      </div>

      {/* Highlighted Banner Notice */}
      {isHighlighted && (
        <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-[11px] font-medium text-amber-900 dark:text-amber-200 animate-in fade-in duration-150">
          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
          <span>Marked as key insight for candidate interview discussion</span>
        </div>
      )}
    </div>
  );
};
