import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Layers, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw,
  LayoutGrid,
  Square,
  Bookmark,
  CheckCircle2,
  FileDown,
  Info
} from 'lucide-react';
import { ReadingDepth } from '../types';
import { generateExecutiveSummaryPdf, generateFullDossierPdf } from '../utils/pdfExport';
import { SECTIONS } from '../data/caseData';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  readingDepth: ReadingDepth;
  markedSectionIds: string[];
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  readingDepth,
  markedSectionIds,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(75);
  const [viewMode, setViewMode] = useState<'continuous' | 'single' | 'spread'>('continuous');
  const [selectedFormat, setSelectedFormat] = useState<'full' | 'executive' | 'saved'>('full');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(12);
  const [showMarginGuides, setShowMarginGuides] = useState<boolean>(false);
  const [inkFriendly, setInkFriendly] = useState<boolean>(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Update total page count based on selected format
  useEffect(() => {
    if (selectedFormat === 'executive') {
      setTotalPages(1);
      setCurrentPage(1);
    } else if (selectedFormat === 'saved') {
      setTotalPages(Math.max(1, markedSectionIds.length));
      setCurrentPage(1);
    } else {
      setTotalPages(12);
    }
  }, [selectedFormat, markedSectionIds]);

  // Construct iframe preview document when modal opens or settings change
  useEffect(() => {
    if (!isOpen || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Gather styles from main document
    const styleTags = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(el => el.outerHTML)
      .join('\n');

    // Filter sections based on selectedFormat
    let targetSections = SECTIONS;
    if (selectedFormat === 'saved') {
      targetSections = SECTIONS.filter(s => markedSectionIds.includes(s.id));
      if (targetSections.length === 0) {
        targetSections = SECTIONS.slice(0, 1);
      }
    } else if (selectedFormat === 'executive') {
      targetSections = [SECTIONS[0]];
    }

    // Build Page Blocks HTML
    const pagesHtml = targetSections.map((sec, idx) => {
      const pageNum = idx + 1;
      const total = targetSections.length;
      
      // Grab rendered DOM markup for this section if available
      const sectionEl = document.getElementById(sec.id);
      let sectionContent = '';
      if (sectionEl) {
        // Clone and sanitize interactive controls
        const clone = sectionEl.cloneNode(true) as HTMLElement;
        clone.querySelectorAll('button:not(.allow-print), .no-print, input, [role="tablist"]').forEach(el => {
          if (!el.classList.contains('print-keep')) {
            el.remove();
          }
        });
        sectionContent = clone.innerHTML;
      } else {
        sectionContent = `
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h2 class="text-lg font-bold text-[#0B1F3A]">${sec.title}</h2>
            <p class="text-xs text-slate-600 mt-2">${sec.summary30s}</p>
          </div>
        `;
      }

      return `
        <div class="a4-page ${showMarginGuides ? 'show-guides' : ''}" id="preview-page-${pageNum}" data-page="${pageNum}">
          <!-- Running Header -->
          <div class="page-header">
            <div class="header-left">
              <span class="brand-title">Product Case Study: Suvam Priyaranjan Sahoo</span>
              <span class="sep">•</span>
              <span class="memo-title">CashKaro APM Strategic Memo</span>
            </div>
            <div class="header-right">
              Confidential Evaluation • sahoosuvampriyaranjan10@gmail.com
            </div>
          </div>

          <!-- Section Content Container -->
          <div class="page-body">
            <div class="section-badge-row">
              <span class="section-num-tag">SECTION ${String(pageNum).padStart(2, '0')}</span>
              <span class="section-title-tag">${sec.shortTitle.toUpperCase()}</span>
            </div>
            <div class="section-injected-content">
              ${sectionContent}
            </div>
          </div>

          <!-- Running Footer -->
          <div class="page-footer">
            <div class="footer-left">
              Evaluation Review • CashKaro Growth & Conversion Routing Architecture
            </div>
            <div class="footer-right">
              Page <strong>${pageNum}</strong> of <strong>${total}</strong>
            </div>
          </div>

          <!-- Safe Margin Overlay (Conditional) -->
          ${showMarginGuides ? '<div class="margin-guide-box"></div>' : ''}
        </div>
      `;
    }).join('\n');

    // Complete HTML structure for sandboxed iframe
    const fullIframeHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Print Preview - CashKaro APM Case Study</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
        ${styleTags}
        <style>
          :root {
            color-scheme: light !important;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            background-color: ${inkFriendly ? '#E2E8F0' : '#0F172A'};
            color: #0F172A !important;
            margin: 0;
            padding: 24px 0;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            font-size: 8.5pt;
            line-height: 1.32;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          /* A4 Sheet Geometry */
          .a4-page {
            width: 210mm;
            min-height: 297mm;
            max-width: 210mm;
            padding: 12mm 10mm;
            margin: 0 auto 16mm auto;
            background: #FFFFFF !important;
            color: #0F172A !important;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22), 0 2px 6px rgba(0, 0, 0, 0.08);
            border: 1px solid #CBD5E1;
            position: relative;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          /* Running Header */
          .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1.5px solid #0B1F3A;
            padding-bottom: 3.5mm;
            margin-bottom: 4mm;
            font-size: 7.5pt;
            color: #0B1F3A;
          }
          .header-left {
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .brand-title {
            font-weight: 800;
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #0B1F3A;
          }
          .sep {
            color: #94A3B8;
          }
          .memo-title {
            font-weight: 500;
            color: #475569;
          }
          .header-right {
            font-family: 'JetBrains Mono', monospace;
            font-size: 6.8pt;
            color: #64748B;
          }

          /* Section Badges */
          .section-badge-row {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 3.5mm;
          }
          .section-num-tag {
            background: #316BEA;
            color: #FFFFFF;
            font-weight: 800;
            font-size: 6.8pt;
            padding: 2px 6px;
            border-radius: 3px;
            letter-spacing: 0.05em;
          }
          .section-title-tag {
            font-size: 7pt;
            font-weight: 700;
            color: #475569;
            letter-spacing: 0.04em;
          }

          /* Body Content */
          .page-body {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          .section-injected-content {
            font-size: 8pt;
            line-height: 1.32;
            color: #1E293B;
          }
          .section-injected-content h1 {
            font-size: 13pt;
            line-height: 1.2;
            margin: 2pt 0 4pt 0;
            color: #0B1F3A;
          }
          .section-injected-content h2 {
            font-size: 10.5pt;
            line-height: 1.2;
            margin: 2pt 0 3pt 0;
            color: #0B1F3A;
          }
          .section-injected-content h3 {
            font-size: 9pt;
            line-height: 1.25;
            margin: 2pt 0 2pt 0;
            color: #1E293B;
          }
          .section-injected-content p {
            font-size: 7.6pt;
            line-height: 1.3;
            margin: 2pt 0 4pt 0;
            color: #1E293B;
          }

          /* Tables */
          table {
            width: 100% !important;
            table-layout: fixed !important;
            border-collapse: collapse !important;
            font-size: 6.8pt !important;
            margin: 4pt 0 !important;
          }
          th, td {
            padding: 3pt 4pt !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            word-break: break-word !important;
            border: 1px solid #CBD5E1 !important;
          }
          th {
            background-color: #F1F5F9 !important;
            color: #1E293B !important;
            font-weight: 700 !important;
          }

          /* Running Footer */
          .page-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #CBD5E1;
            padding-top: 3mm;
            margin-top: 4mm;
            font-size: 7pt;
            color: #64748B;
          }
          .footer-right strong {
            color: #316BEA;
            font-family: 'JetBrains Mono', monospace;
          }

          /* Safe Margin Guide Overlay */
          .margin-guide-box {
            position: absolute;
            top: 12mm;
            bottom: 12mm;
            left: 10mm;
            right: 10mm;
            border: 1px dashed rgba(239, 68, 68, 0.45);
            pointer-events: none;
          }
          .margin-guide-box::before {
            content: '12mm x 10mm Print Margin Safe Zone';
            position: absolute;
            top: -9px;
            right: 0;
            font-size: 5.5pt;
            font-family: 'JetBrains Mono', monospace;
            background: #FEE2E2;
            color: #DC2626;
            padding: 1px 4px;
            border-radius: 2px;
          }
        </style>
      </head>
      <body>
        ${pagesHtml}
      </body>
      </html>
    `;

    doc.open();
    doc.write(fullIframeHtml);
    doc.close();
  }, [isOpen, selectedFormat, showMarginGuides, inkFriendly, markedSectionIds]);

  if (!isOpen) return null;

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(150, Math.max(40, prev + delta)));
  };

  const handlePrintFromPreview = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print();
    } else {
      window.print();
    }
  };

  const handleExportPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      if (selectedFormat === 'executive') {
        await generateExecutiveSummaryPdf({
          candidateName: 'SUVAM PRIYARANJAN SAHOO',
          candidateEmail: 'sahoosuvampriyaranjan10@gmail.com',
          readingDepth,
          inkFriendly,
        });
      } else if (selectedFormat === 'saved') {
        await generateFullDossierPdf({
          mode: 'saved-insights',
          markedSectionIds,
          candidateName: 'SUVAM PRIYARANJAN SAHOO',
          candidateEmail: 'sahoosuvampriyaranjan10@gmail.com',
          readingDepth,
          inkFriendly,
        });
      } else {
        await generateFullDossierPdf({
          mode: 'full-dossier',
          candidateName: 'SUVAM PRIYARANJAN SAHOO',
          candidateEmail: 'sahoosuvampriyaranjan10@gmail.com',
          readingDepth,
          inkFriendly,
        });
      }
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const scrollToPageInIframe = (pageNum: number) => {
    setCurrentPage(pageNum);
    if (!iframeRef.current?.contentDocument) return;
    const targetEl = iframeRef.current.contentDocument.getElementById(`preview-page-${pageNum}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      id="print-preview-modal" 
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/85 backdrop-blur-md flex flex-col animate-in fade-in duration-200"
    >
      {/* Top Header / Toolbar */}
      <div className="bg-[#0B1728] text-white border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shrink-0 shadow-md">
        
        {/* Title & Document Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#316BEA] to-blue-500 flex items-center justify-center text-white shadow-sm">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold font-display tracking-tight text-white">
                A4 Document Print Preview
              </h2>
              <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                A4 210 × 297 mm
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Inspect multi-page pagination, table scaling, & safe margins before printing
            </p>
          </div>
        </div>

        {/* Format Selector Pills */}
        <div className="hidden lg:flex items-center bg-slate-900 border border-slate-700/80 p-1 rounded-xl gap-1 text-xs">
          <button
            onClick={() => setSelectedFormat('full')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFormat === 'full'
                ? 'bg-[#316BEA] text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Full Dossier (12 Pages)</span>
          </button>

          <button
            onClick={() => setSelectedFormat('executive')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFormat === 'executive'
                ? 'bg-[#316BEA] text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Executive 1-Pager</span>
          </button>

          <button
            onClick={() => setSelectedFormat('saved')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFormat === 'saved'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({markedSectionIds.length})</span>
          </button>
        </div>

        {/* Zoom & Inspection Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => handleZoom(-10)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] font-semibold text-slate-300">
              {zoomLevel}%
            </span>
            <button
              onClick={() => handleZoom(10)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(75)}
              className="px-1.5 py-1 text-[10px] text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title="Reset Zoom to 75%"
            >
              Reset
            </button>
          </div>

          {/* Margin Guides Toggle */}
          <button
            onClick={() => setShowMarginGuides(!showMarginGuides)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              showMarginGuides
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Toggle print safe margin bounds (12mm x 10mm)"
          >
            <Square className="w-3.5 h-3.5" />
            <span className="text-[11px]">Safe Margins</span>
          </button>

          {/* Direct Print Button */}
          <button
            onClick={handlePrintFromPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#316BEA] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer hover:scale-[1.02]"
            title="Send to browser print dialog"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Now</span>
          </button>

          {/* Export PDF Button */}
          <button
            onClick={handleExportPdf}
            disabled={isGeneratingPdf}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            title="Export high-resolution vector PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isGeneratingPdf ? 'Generating...' : 'Export PDF'}</span>
          </button>

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close Print Preview"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

      </div>

      {/* Main Preview Container with Sandboxed Iframe */}
      <div className="flex-1 bg-slate-900/90 relative overflow-auto flex justify-center p-4 sm:p-8">
        
        {/* Sandboxed Iframe Rendering A4 Scaled Sheets */}
        <div 
          className="transition-transform duration-150 origin-top"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            width: '210mm',
          }}
        >
          <iframe
            ref={iframeRef}
            id="print-preview-iframe"
            title="A4 Print Document Preview"
            sandbox="allow-same-origin allow-scripts"
            className="w-[210mm] min-h-[3600px] border-0 rounded shadow-2xl bg-white"
          />
        </div>

      </div>

      {/* Bottom Sticky Page Navigator Bar */}
      <div className="bg-[#0B1728] border-t border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-slate-400 shrink-0">
        
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">
            Print layout accurately emulates A4 portrait sheet geometry with isolated 12mm/10mm padding.
          </span>
          <span className="sm:hidden font-mono text-[11px]">
            A4 210×297mm
          </span>
        </div>

        {/* Page Jumping Bar */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">
            Jump to Section:
          </span>
          <select
            value={currentPage}
            onChange={(e) => scrollToPageInIframe(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none"
          >
            {SECTIONS.slice(0, totalPages).map((sec, idx) => (
              <option key={sec.id} value={idx + 1}>
                Page {idx + 1}: {sec.shortTitle}
              </option>
            ))}
          </select>
        </div>

      </div>

    </div>
  );
};
