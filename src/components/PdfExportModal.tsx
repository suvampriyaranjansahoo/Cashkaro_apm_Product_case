import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Layers, 
  Bookmark, 
  CheckCircle2, 
  Eye, 
  Printer, 
  Loader2, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  FileDown, 
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';
import { generateExact14PageCasePdf } from '../utils/exactDocExport';
import { generateExecutiveSummaryPdf, generateFullDossierPdf, waitForDomAndAssetsReadiness } from '../utils/pdfExport';
import { ReadingDepth } from '../types';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  readingDepth: ReadingDepth;
  markedSectionIds: string[];
  onOpenPrintPreview?: () => void;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  readingDepth,
  markedSectionIds,
  onOpenPrintPreview,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'exact-doc' | 'executive' | 'full' | 'saved'>('exact-doc');
  const [inkFriendly, setInkFriendly] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsGenerating(true);
    setProgress(5);
    setStatusText('Preparing export configuration...');
    setSuccessNotice(null);
    setErrorNotice(null);

    try {
      if (selectedFormat === 'exact-doc') {
        await generateExact14PageCasePdf({
          onProgress: (p, text) => {
            setProgress(p);
            setStatusText(text);
          }
        });
        setSuccessNotice('Official 14-Page CashKaro APM Assignment PDF downloaded successfully!');
      } else if (selectedFormat === 'executive') {
        setProgress(50);
        setStatusText('Composing Executive 1-Pager layout...');
        await generateExecutiveSummaryPdf({
          candidateName: 'SUVAM PRIYARANJAN SAHOO',
          candidateEmail: 'sahoosuvampriyaranjan10@gmail.com',
          readingDepth,
          inkFriendly,
        });
        setProgress(100);
        setStatusText('Executive 1-Pager exported successfully!');
        setSuccessNotice('Executive Brief PDF has been downloaded.');
      } else if (selectedFormat === 'full') {
        await waitForDomAndAssetsReadiness((pct, msg) => {
          setProgress(pct);
          setStatusText(msg);
        });
        await generateFullDossierPdf({
          mode: 'full-dossier',
          candidateName: 'SUVAM PRIYARANJAN SAHOO',
          candidateEmail: 'sahoosuvampriyaranjan10@gmail.com',
          readingDepth,
          inkFriendly,
          onProgress: (p, text) => {
            setProgress(p);
            setStatusText(text);
          },
        });
        setSuccessNotice('Live App HTML-Rendered Dossier PDF has been downloaded.');
      } else if (selectedFormat === 'saved') {
        if (markedSectionIds.length === 0) {
          setErrorNotice('No sections have been bookmarked yet. Please bookmark insights first or export the full dossier.');
          setIsGenerating(false);
          return;
        }
        await waitForDomAndAssetsReadiness((pct, msg) => {
          setProgress(pct);
          setStatusText(msg);
        });
        await generateFullDossierPdf({
          mode: 'saved-insights',
          markedSectionIds,
          candidateName: 'SUVAM PRIYARANJAN SAHOO',
          candidateEmail: 'sahoosuvampriyaranjan10@gmail.com',
          readingDepth,
          inkFriendly,
          onProgress: (p, text) => {
            setProgress(p);
            setStatusText(text);
          },
        });
        setSuccessNotice(`Saved Insights PDF (${markedSectionIds.length} sections) downloaded.`);
      }
    } catch (err) {
      console.error('PDF export error:', err);
      setErrorNotice('PDF generation encountered an error. Please try another format or browser print.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBrowserPrint = async () => {
    setIsGenerating(true);
    setProgress(20);
    setStatusText('Preparing print styles & awaiting font/asset readiness...');
    try {
      await waitForDomAndAssetsReadiness((pct, msg) => {
        setProgress(pct);
        setStatusText(msg);
      });
      window.print();
    } catch (err) {
      console.error('Browser print error:', err);
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0E1726] border border-[#DEB6C5] dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col transition-colors">
        
        {/* Header */}
        <div className="bg-[#0B1728] text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D190AC] dark:bg-[#0080AB] flex items-center justify-center text-white shadow-md shrink-0">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-display tracking-tight text-white">
                  Export Strategy Case as PDF
                </h2>
                <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                  Offline Dossier
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Authored by Suvam Priyaranjan Sahoo • APM Candidate
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close export modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
          
          {/* Format Selection Cards */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Select Export Format:
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Option 1: EXACT 14-PAGE CASE STUDY (FEATURED / DEFAULT) */}
              <button
                onClick={() => setSelectedFormat('exact-doc')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                  selectedFormat === 'exact-doc'
                    ? 'border-[#D190AC] dark:border-[#0080AB] bg-[#F0EAD5] dark:bg-blue-950/60 ring-2 ring-[#D190AC]/40 dark:ring-[#0080AB]/40 shadow-sm'
                    : 'border-[#DEB6C5]/50 dark:border-slate-800 bg-[#F7F6ED] dark:bg-slate-900/60 hover:bg-[#F0EAD5] dark:hover:bg-slate-800'
                }`}
              >
                <div className="absolute top-0 right-0 bg-[#D190AC] dark:bg-[#0080AB] text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-bl-lg">
                  RECOMMENDED
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-[#D190AC]/20 dark:bg-blue-600/10 text-[#8F3760] dark:text-blue-400 flex items-center justify-center font-bold">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    {selectedFormat === 'exact-doc' && (
                      <CheckCircle2 className="w-4 h-4 text-[#8F3760] dark:text-blue-400" />
                    )}
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white mt-2 text-xs sm:text-sm">
                    Exact 14-Page Assignment PDF
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                    The complete official APM case submission with exact tables, G1-G4 gates, sensitivity math, and operating model.
                  </p>
                </div>
                <div className="mt-2.5 text-[10px] font-mono text-[#8F3760] dark:text-blue-300 font-semibold flex items-center gap-1">
                  <span>📄 Exact 14 Pages • Full Assignment</span>
                </div>
              </button>

              {/* Option 2: Executive 1-Pager Brief */}
              <button
                onClick={() => setSelectedFormat('executive')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedFormat === 'executive'
                    ? 'border-[#D190AC] dark:border-[#0080AB] bg-[#F0EAD5] dark:bg-blue-950/40 ring-2 ring-[#D190AC]/30 dark:ring-[#0080AB]/30'
                    : 'border-[#DEB6C5]/50 dark:border-slate-800 bg-[#F7F6ED] dark:bg-slate-900/60 hover:bg-[#F0EAD5] dark:hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    {selectedFormat === 'executive' && (
                      <CheckCircle2 className="w-4 h-4 text-[#8F3760] dark:text-blue-400" />
                    )}
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white mt-2 text-xs sm:text-sm">
                    Executive 1-Pager Brief
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                    Single-page executive decision summary designed for quick 60-second review by hiring managers.
                  </p>
                </div>
                <div className="mt-2.5 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                  ⚡ 1-Page Summary • Instant Download
                </div>
              </button>

              {/* Option 3: Full Live App Capture */}
              <button
                onClick={() => setSelectedFormat('full')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedFormat === 'full'
                    ? 'border-[#D190AC] dark:border-[#0080AB] bg-[#F0EAD5] dark:bg-blue-950/40 ring-2 ring-[#D190AC]/30 dark:ring-[#0080AB]/30'
                    : 'border-[#DEB6C5]/50 dark:border-slate-800 bg-[#F7F6ED] dark:bg-slate-900/60 hover:bg-[#F0EAD5] dark:hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold">
                      <Layers className="w-4 h-4" />
                    </div>
                    {selectedFormat === 'full' && (
                      <CheckCircle2 className="w-4 h-4 text-[#8F3760] dark:text-blue-400" />
                    )}
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white mt-2 text-xs sm:text-sm">
                    Live UI Capture Dossier
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                    DOM-rendered capture of the live interactive web app modules.
                  </p>
                </div>
                <div className="mt-2.5 text-[10px] font-mono text-indigo-700 dark:text-indigo-400 font-semibold">
                  🌐 Live Web Modules Capture
                </div>
              </button>

              {/* Option 4: Recruiter Marked Insights */}
              <button
                onClick={() => setSelectedFormat('saved')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedFormat === 'saved'
                    ? 'border-[#D190AC] dark:border-[#0080AB] bg-[#F0EAD5] dark:bg-blue-950/40 ring-2 ring-[#D190AC]/30 dark:ring-[#0080AB]/30'
                    : 'border-[#DEB6C5]/50 dark:border-slate-800 bg-[#F7F6ED] dark:bg-slate-900/60 hover:bg-[#F0EAD5] dark:hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-amber-600/10 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                      <Bookmark className="w-4 h-4" />
                    </div>
                    {selectedFormat === 'saved' && (
                      <CheckCircle2 className="w-4 h-4 text-[#8F3760] dark:text-blue-400" />
                    )}
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white mt-2 text-xs sm:text-sm">
                    Saved Bookmarked Insights
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                    Curated custom PDF with only your bookmarked sections.
                  </p>
                </div>
                <div className="mt-2.5 text-[10px] font-mono text-amber-700 dark:text-amber-400 font-semibold">
                  ⭐ {markedSectionIds.length} Saved Section{markedSectionIds.length === 1 ? '' : 's'}
                </div>
              </button>

            </div>
          </div>

          {/* Options Checklist */}
          <div className="bg-[#F0EAD5]/60 dark:bg-slate-900/70 p-4 rounded-xl border border-[#DEB6C5]/60 dark:border-slate-800 space-y-2.5 transition-colors">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-300">
              Export Formatting Preferences:
            </div>
            
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-400">
              <input
                type="checkbox"
                checked={inkFriendly}
                onChange={(e) => setInkFriendly(e.target.checked)}
                className="rounded border-[#DEB6C5] text-[#8F3760] focus:ring-[#D190AC]"
              />
              <span><strong>Ink-Friendly Light Background:</strong> Optimizes contrast and saves printer toner during physical printouts.</span>
            </label>

            <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-[#DEB6C5]/40 dark:border-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Includes candidate contact: <strong>sahoosuvampriyaranjan10@gmail.com</strong> & date watermark.</span>
            </div>
          </div>

          {/* Live Progress Indicator */}
          {isGenerating && (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-800 dark:text-blue-300">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#8F3760] dark:text-[#316BEA]" />
                  {statusText}
                </span>
                <span className="font-mono">{progress}%</span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-900/60 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#D190AC] dark:bg-[#0080AB] h-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success / Error Messages */}
          {successNotice && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {errorNotice && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-[#F7F6ED] dark:bg-slate-900 p-4 border-t border-[#DEB6C5]/60 dark:border-slate-800 flex items-center justify-between gap-3 transition-colors">
          <div className="flex items-center gap-2">
            {onOpenPrintPreview && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPrintPreview();
                }}
                disabled={isGenerating}
                className="px-3.5 py-2 rounded-lg border border-[#DEB6C5]/60 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs font-semibold hover:bg-[#F0EAD5] dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Inspect A4 layout, safe margins, and pagination"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Print Preview</span>
              </button>
            )}

            <button
              onClick={handleBrowserPrint}
              disabled={isGenerating}
              className="px-3.5 py-2 rounded-lg border border-[#DEB6C5]/60 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs font-semibold hover:bg-[#F0EAD5] dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Open browser system print dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Browser Print</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            
            <button
              onClick={handleExport}
              disabled={isGenerating}
              className="px-5 py-2 rounded-lg bg-[#D190AC] dark:bg-[#0080AB] hover:bg-[#8F3760] dark:hover:bg-blue-600 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Case Study PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
