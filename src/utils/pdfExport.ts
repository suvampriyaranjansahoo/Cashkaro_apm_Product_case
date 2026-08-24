import { jsPDF } from 'jspdf';
import { 
  HYPOTHESES, 
  VALIDATION_GATES, 
  MIND_CHANGE_SCENARIOS, 
  ACCEPTANCE_CRITERIA, 
  PRIORITIZATION_DIRECTIONS, 
  SECTIONS 
} from '../data/caseData';

export interface PdfExportOptions {
  mode: 'executive-summary' | 'full-dossier' | 'saved-insights';
  candidateName?: string;
  candidateEmail?: string;
  readingDepth?: string;
  markedSectionIds?: string[];
  inkFriendly?: boolean;
  onProgress?: (percent: number, statusText: string) => void;
}

// Color Palette Constants for Native Vector Rendering
const COLORS = {
  navyDark: [11, 23, 40] as [number, number, number],      // #0B1728
  navyAccent: [11, 31, 58] as [number, number, number],    // #0B1F3A
  primaryBlue: [49, 107, 234] as [number, number, number], // #316BEA
  lightBlueBg: [235, 242, 254] as [number, number, number],// #EBF2FE
  borderBlue: [198, 220, 253] as [number, number, number], // #C6DCFD
  textDark: [30, 41, 59] as [number, number, number],      // #1E293B
  textMuted: [100, 116, 139] as [number, number, number],  // #64748B
  cardBg: [248, 250, 252] as [number, number, number],     // #F8FAFC
  cardBorder: [226, 232, 240] as [number, number, number], // #E2E8F0
  emeraldGreen: [21, 154, 104] as [number, number, number],// #159A68
  emeraldBg: [236, 253, 245] as [number, number, number],  // #ECFDF5
  emeraldBorder: [167, 243, 208] as [number, number, number], // #A7F3D0
  amberAlert: [194, 122, 20] as [number, number, number],  // #C27A14
  amberBg: [254, 243, 199] as [number, number, number],    // #FEF3C7
  amberBorder: [253, 230, 138] as [number, number, number], // #FDE68A
  redAlert: [189, 59, 52] as [number, number, number],     // #BD3B34
  redBg: [254, 242, 242] as [number, number, number],      // #FEF2F2
  redBorder: [254, 202, 202] as [number, number, number],  // #FECACA
  purpleAccent: [124, 58, 237] as [number, number, number], // #7C3AED
  purpleBg: [245, 243, 255] as [number, number, number],   // #F5F3FF
  purpleBorder: [221, 214, 254] as [number, number, number],// #DDD6FE
  slateHeader: [241, 245, 249] as [number, number, number], // #F1F5F9
  white: [255, 255, 255] as [number, number, number],
};

/**
 * Parsed DOM Content Structure for any section
 */
export interface SectionDomData {
  id: string;
  foundInDom: boolean;
  title: string;
  subtitle: string;
  paragraphs: string[];
  bulletPoints: string[];
  keyCallouts: string[];
  rawTextExcerpt: string;
}

/**
 * Robust element selector identifying all major content containers in strict DOM order.
 * Queries main > section, [data-section-id], section[id] and maps live elements.
 */
export function getAllContentSectionElements(): { id: string; element: HTMLElement; title: string }[] {
  if (typeof document === 'undefined') return [];

  const rawElements = Array.from(
    document.querySelectorAll<HTMLElement>('main > section, [data-section-id], section[id]')
  );

  const seenIds = new Set<string>();
  const results: { id: string; element: HTMLElement; title: string }[] = [];

  for (const el of rawElements) {
    const sectionId = (el.getAttribute('data-section-id') || el.id || '').trim();
    if (!sectionId || seenIds.has(sectionId)) continue;
    seenIds.add(sectionId);

    const headingEl = el.querySelector<HTMLElement>('h1, h2, h3, h4');
    const title = (headingEl?.textContent || el.getAttribute('data-section-title') || sectionId)
      .replace(/\s+/g, ' ')
      .trim();

    results.push({
      id: sectionId,
      element: el,
      title,
    });
  }

  return results;
}

/**
 * Explicitly waits for document web fonts (document.fonts.ready),
 * all dynamic images (img.complete / img.onload), and chart canvas/SVG
 * elements to finish layout rendering before capturing DOM or generating PDF.
 */
export async function waitForDomAndAssetsReadiness(
  onProgress?: (percent: number, statusText: string) => void
): Promise<void> {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  onProgress?.(12, 'Verifying document typography & web fonts (document.fonts.ready)...');
  // 1. Wait for document.fonts.ready
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn('document.fonts.ready warning:', e);
    }
  }

  onProgress?.(22, 'Ensuring all dynamic images & chart graphics are loaded (Image.onload)...');
  // 2. Wait for all <img> tags to complete loading
  const images = Array.from(document.querySelectorAll<HTMLImageElement>('img'));
  if (images.length > 0) {
    const imagePromises = images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        const cleanup = () => {
          img.removeEventListener('load', onLoad);
          img.removeEventListener('error', onError);
          resolve();
        };
        const onLoad = () => cleanup();
        const onError = () => cleanup();
        img.addEventListener('load', onLoad);
        img.addEventListener('error', onError);
        // Fallback safety timeout (1200ms)
        setTimeout(cleanup, 1200);
      });
    });
    await Promise.all(imagePromises);
  }

  onProgress?.(30, 'Stabilizing interactive chart animations & vector layouts...');
  // 3. Wait for requestAnimationFrame and SVG/Canvas charts (Recharts) to settle
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(resolve, 180);
      });
    });
  });
}

/**
 * Robust DOM Parser: Safely captures text and structure from live DOM elements.
 * Verifies element references are not null before inspecting children.
 */
export function extractSectionDomData(sectionId: string, fallbackTitle: string): SectionDomData {
  if (typeof document === 'undefined') {
    return {
      id: sectionId,
      foundInDom: false,
      title: fallbackTitle,
      subtitle: '',
      paragraphs: [],
      bulletPoints: [],
      keyCallouts: [],
      rawTextExcerpt: '',
    };
  }

  // Check candidate IDs in the DOM
  const candidateIds = [
    sectionId,
    `section-${sectionId}`,
    sectionId === 'validation' ? 'validation-gates' : '',
    sectionId === 'validation-gates' ? 'validation' : '',
    sectionId === 'decision' ? 'final-decision' : '',
    sectionId === 'final-decision' ? 'decision' : '',
  ].filter(Boolean);

  let targetElement: HTMLElement | null = null;
  for (const id of candidateIds) {
    const el = document.getElementById(id) || document.querySelector<HTMLElement>(`[data-section-id="${id}"]`);
    if (el) {
      targetElement = el;
      break;
    }
  }

  // Fallback to query selector if not found by direct ID
  if (!targetElement) {
    targetElement = document.querySelector<HTMLElement>(`section[id*="${sectionId}"], [data-section-id*="${sectionId}"]`);
  }

  if (!targetElement) {
    return {
      id: sectionId,
      foundInDom: false,
      title: fallbackTitle,
      subtitle: '',
      paragraphs: [],
      bulletPoints: [],
      keyCallouts: [],
      rawTextExcerpt: '',
    };
  }

  // Extract titles from headings
  const headings = Array.from(targetElement.querySelectorAll('h1, h2, h3, h4'))
    .map((h) => (h.textContent || '').trim())
    .filter((t) => t.length > 0 && !t.includes('Copy link') && !t.includes('Bookmark'));

  const title = headings[0] || fallbackTitle;
  const subtitle = headings[1] || '';

  // Extract text paragraphs
  const paragraphs = Array.from(targetElement.querySelectorAll('p'))
    .map((p) => (p.textContent || '').trim())
    .filter((t) => t.length > 25 && !t.includes('Click to copy') && !t.includes('Bookmark section'))
    .slice(0, 8);

  // Extract list items
  const bulletPoints = Array.from(targetElement.querySelectorAll('li'))
    .map((li) => (li.textContent || '').trim())
    .filter((t) => t.length > 10 && t.length < 300)
    .slice(0, 10);

  // Extract key highlighted callouts / badges
  const callouts = Array.from(targetElement.querySelectorAll('strong, blockquote, [data-callout]'))
    .map((c) => (c.textContent || '').trim())
    .filter((t) => t.length > 15 && t.length < 220)
    .slice(0, 6);

  const rawText = (targetElement.innerText || '').replace(/\s+/g, ' ').trim();

  return {
    id: sectionId,
    foundInDom: true,
    title,
    subtitle,
    paragraphs,
    bulletPoints,
    keyCallouts: callouts,
    rawTextExcerpt: rawText.substring(0, 500),
  };
}

/**
 * Draws standard header on any PDF page
 */
function drawHeader(
  doc: jsPDF, 
  pageWidth: number, 
  margin: number, 
  title: string, 
  subtitle: string,
  candidateName: string,
  candidateEmail: string
) {
  // Top Navy Bar
  doc.setFillColor(...COLORS.navyDark);
  doc.rect(0, 0, pageWidth, 22, 'F');

  // Blue Accent Stripe
  doc.setFillColor(...COLORS.primaryBlue);
  doc.rect(0, 0, pageWidth, 2, 'F');

  // Title
  doc.setTextColor(...COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.0);
  doc.text(title, margin, 9.5);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.0);
  doc.setTextColor(198, 220, 253);
  doc.text(subtitle, margin, 15);

  // Right Candidate Credentials
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.0);
  doc.setTextColor(...COLORS.white);
  doc.text(candidateName, pageWidth - margin, 9.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(148, 163, 184);
  doc.text(`APM Candidate • ${candidateEmail}`, pageWidth - margin, 15, { align: 'right' });
}

/**
 * Draws standard footer on any PDF page
 */
function drawFooter(
  doc: jsPDF, 
  pageWidth: number, 
  pageHeight: number, 
  margin: number, 
  pageNum: number, 
  totalPages: number,
  dateStr: string
) {
  const footerY = pageHeight - 8;
  doc.setDrawColor(...COLORS.cardBorder);
  doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...COLORS.textMuted);
  doc.text(`Product Case Study: Suvam Priyaranjan Sahoo • sahoosuvampriyaranjan10@gmail.com • Confidential APM Memo`, margin, footerY + 2);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, footerY + 2, { align: 'right' });
}

/**
 * Generates an ultra-crisp, vector-styled Executive 1-Pager Brief in A4 format (100% Vector, never blank).
 * Fills the full A4 canvas with balanced typography, generous padding, and zero awkward whitespace.
 */
export const generateExecutiveSummaryPdf = async (
  options?: Partial<PdfExportOptions>
): Promise<void> => {
  const candidateName = options?.candidateName || 'SUVAM PRIYARANJAN SAHOO';
  const candidateEmail = options?.candidateEmail || 'sahoosuvampriyaranjan10@gmail.com';
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  // Header
  drawHeader(
    doc,
    pageWidth,
    margin,
    'CASHKARO APM PRODUCT INVESTMENT MEMO (EXECUTIVE BRIEF)',
    'HYPOTHESIS-LED STRATEGY TO PLUG SHOPPING LEAKAGE VIA INTENT ROUTING',
    candidateName,
    candidateEmail
  );

  let y = 26;

  // 1. Executive Thesis Box (Balanced Height: 26mm)
  doc.setFillColor(...COLORS.lightBlueBg);
  doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'F');
  doc.setDrawColor(...COLORS.borderBlue);
  doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'D');

  doc.setTextColor(...COLORS.primaryBlue);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.0);
  doc.text('CORE STRATEGIC THESIS & ROOT-CAUSE DIAGNOSIS', margin + 4, y + 5.5);

  doc.setTextColor(...COLORS.textDark);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const thesisText = doc.splitTextToSize(
    'Direct retailer leakage is an outcome, not an awareness deficit. High-frequency existing CashKaro shoppers experience severe switching friction when late recall occurs after arriving at merchant storefronts. Navigating back risks losing active carts, deals, and focus. The proposed consented Intent Router meets the user at the moment of intent, removing friction in 1 tap without page reloads or checkout disruption.',
    contentWidth - 8
  );
  doc.text(thesisText, margin + 4, y + 11.5);

  y += 30;

  // 2. Metrics Grid (4 High-Impact KPI Cards, Height: 22mm)
  const boxWidth = (contentWidth - 9) / 4;
  const metrics = [
    { label: 'NORTH STAR CAUSAL LIFT', val: '+0.12 ΔO / user', sub: 'Incremental orders/user', color: COLORS.primaryBlue },
    { label: 'CAUSAL STANDARD', val: '50/50 ITT', sub: 'Persistent Holdout Cohort', color: COLORS.emeraldGreen },
    { label: 'Q1 TARGET MARGIN', val: '₹1.52M+ Net', sub: 'Gross contribution profit', color: COLORS.navyAccent },
    { label: 'SECURITY BOUND', val: 'Fail-Closed', sub: 'Precedence & privacy lock', color: COLORS.amberAlert },
  ];

  metrics.forEach((m, idx) => {
    const x = margin + idx * (boxWidth + 3);
    doc.setFillColor(...COLORS.cardBg);
    doc.roundedRect(x, y, boxWidth, 22, 1.5, 1.5, 'F');
    doc.setDrawColor(...COLORS.cardBorder);
    doc.roundedRect(x, y, boxWidth, 22, 1.5, 1.5, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.2);
    doc.setTextColor(...COLORS.textMuted);
    doc.text(m.label, x + boxWidth / 2, y + 5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...m.color);
    doc.text(m.val, x + boxWidth / 2, y + 12, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.textMuted);
    doc.text(m.sub, x + boxWidth / 2, y + 18, { align: 'center' });
  });

  y += 26;

  // 3. Hypotheses Table (Height: 40mm)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.0);
  doc.setTextColor(...COLORS.navyAccent);
  doc.text('HYPOTHESES & STRATEGIC BETS (H1 — H4)', margin, y + 3.5);

  y += 5.5;

  const hypotheses = [
    {
      code: 'H1',
      title: 'Intent Routing (Selected V1)',
      problem: 'Cart drop-off from reload restarts',
      sol: '1-tap affiliate injection without reload',
      gate: 'G1 Discovery ≥60%',
      status: 'SELECTED V1 BET',
      statusColor: COLORS.primaryBlue,
    },
    {
      code: 'H2',
      title: 'Trust & Reliability Guardrails',
      problem: 'Post-purchase dispute friction',
      sol: 'Transparent dispute postbacks & SLAs',
      gate: 'Dispute Rate <2%',
      status: 'LAUNCH GUARDRAIL',
      statusColor: COLORS.emeraldGreen,
    },
    {
      code: 'H3',
      title: 'Pre-Purchase Search Assistant',
      problem: 'Category comparison discovery',
      sol: 'Overlay deal comparison widget',
      gate: 'High CAC & Retailer Risk',
      status: 'KILL (Low Yield)',
      statusColor: COLORS.redAlert,
    },
    {
      code: 'H4',
      title: 'Predictive Push & Reminders',
      problem: 'Repurchase cycle notification leakage',
      sol: 'Cadence-based timing re-engagement',
      gate: 'Low Incrementality',
      status: 'DEFER / SECONDARY',
      statusColor: COLORS.amberAlert,
    },
  ];

  // Table Header
  doc.setFillColor(...COLORS.slateHeader);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text('CODE', margin + 2, y + 4);
  doc.text('BET NAME', margin + 14, y + 4);
  doc.text('MECHANISM / SOLUTION', margin + 58, y + 4);
  doc.text('GATE / CRITERION', margin + 120, y + 4);
  doc.text('DECISION', margin + 152, y + 4);

  y += 5.5;

  hypotheses.forEach((h, i) => {
    doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
    doc.rect(margin, y, contentWidth, 7.2, 'F');
    doc.setDrawColor(...COLORS.cardBorder);
    doc.line(margin, y + 7.2, margin + contentWidth, y + 7.2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(...h.statusColor);
    doc.text(h.code, margin + 2, y + 4.8);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.textDark);
    doc.text(h.title, margin + 14, y + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(71, 85, 105);
    doc.text(h.sol, margin + 58, y + 4.8);
    doc.text(h.gate, margin + 120, y + 4.8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(...h.statusColor);
    doc.text(h.status, margin + 152, y + 4.8);

    y += 7.2;
  });

  y += 5.5;

  // 4. Two-Column Split: Solution Architecture & Governance Gates (Height: 52mm)
  const colWidth = (contentWidth - 6) / 2;

  // Left Column: V1 Intent Router Solution Spec
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(...COLORS.navyAccent);
  doc.text('V1 INTENT ROUTER SPECIFICATION', margin, y + 3.5);

  doc.setFillColor(...COLORS.cardBg);
  doc.roundedRect(margin, y + 5.5, colWidth, 48, 1.5, 1.5, 'F');
  doc.setDrawColor(...COLORS.cardBorder);
  doc.roundedRect(margin, y + 5.5, colWidth, 48, 1.5, 1.5, 'D');

  const specLines = [
    { label: 'Surface', val: 'Desktop Chrome Extension on top 3-5 allowlisted merchants' },
    { label: 'Activation', val: 'Passive URL match -> Compact floating pill (0.3s transition)' },
    { label: 'Handshake', val: 'Background tab affiliate token injection without page reload' },
    { label: 'Session Token', val: 'Secure S2S session ID bound to affiliate redirect payload' },
    { label: 'Fail-Safe', val: 'Pre-existing affiliate cookies respect precedence (Fail-Closed)' },
    { label: 'Privacy Bound', val: 'Zero scraping of non-partner URLs, cart values, or PII' },
  ];

  let specY = y + 11;
  specLines.forEach((s) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(...COLORS.primaryBlue);
    doc.text(`• ${s.label}:`, margin + 3.5, specY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.textDark);
    doc.text(s.val, margin + 22, specY);
    specY += 6.5;
  });

  // Right Column: 4-Gate Governance & Kill Criteria
  const rightX = margin + colWidth + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(...COLORS.navyAccent);
  doc.text('4-STAGE VALIDATION GATES', rightX, y + 3.5);

  doc.setFillColor(...COLORS.cardBg);
  doc.roundedRect(rightX, y + 5.5, colWidth, 48, 1.5, 1.5, 'F');
  doc.setDrawColor(...COLORS.cardBorder);
  doc.roundedRect(rightX, y + 5.5, colWidth, 48, 1.5, 1.5, 'D');

  const gates = [
    { code: 'G1 Discovery', crit: '≥60% users report shopping restart friction', act: 'Pass -> Build prototype' },
    { code: 'G2 Addressability', crit: '≥40% of leakage on top 3–5 desktop retailers', act: 'Pass -> Pilot extension' },
    { code: 'G3 S2S Postback', crit: 'Attribution postback accuracy ≥98.5%', act: 'Pass -> Enable 50/50 ITT' },
    { code: 'G4 50/50 Causal', crit: 'ΔO ≥ +0.08 / user & net profit positive', act: 'Pass -> Scale rollout' },
  ];

  let gateY = y + 11;
  gates.forEach((g) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(...COLORS.emeraldGreen);
    doc.text(`[${g.code}]`, rightX + 3.5, gateY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.textDark);
    doc.text(`${g.crit} -> ${g.act}`, rightX + 27, gateY);
    gateY += 9.5;
  });

  y += 58;

  // 5. Financial Sensitivity & Causal Economics Table (Height: 34mm)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(...COLORS.navyAccent);
  doc.text('FINANCIAL SCENARIO MODEL (25,000 ELIGIBLE USERS PILOT)', margin, y + 3.5);

  y += 5.5;

  doc.setFillColor(...COLORS.slateHeader);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text('SCENARIO', margin + 3, y + 4);
  doc.text('CAUSAL LIFT (ΔO)', margin + 38, y + 4);
  doc.text('INCR. ORDERS', margin + 74, y + 4);
  doc.text('GROSS REVENUE', margin + 108, y + 4);
  doc.text('NET CONTRIBUTION PROFIT', margin + 144, y + 4);

  y += 5.5;

  const scenarios = [
    { name: 'Conservative (Stress)', lift: '+0.04 orders', ord: '1,000', rev: '₹2.40L', net: '₹1.15L (Break-even +)', color: COLORS.textMuted },
    { name: 'Base Case (Target Model)', lift: '+0.12 orders', ord: '3,000', rev: '₹7.20L', net: '₹5.45L Net Margin', color: COLORS.primaryBlue },
    { name: 'High AOV / Electronics', lift: '+0.15 orders', ord: '3,750', rev: '₹18.00L', net: '₹14.25L Net Margin', color: COLORS.emeraldGreen },
  ];

  scenarios.forEach((sc, i) => {
    doc.setFillColor(i === 1 ? 235 : 255, i === 1 ? 242 : 255, i === 1 ? 254 : 255);
    doc.rect(margin, y, contentWidth, 6.8, 'F');
    doc.setDrawColor(...COLORS.cardBorder);
    doc.line(margin, y + 6.8, margin + contentWidth, y + 6.8);

    doc.setFont('helvetica', i === 1 ? 'bold' : 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(...COLORS.textDark);
    doc.text(sc.name, margin + 3, y + 4.5);
    doc.text(sc.lift, margin + 38, y + 4.5);
    doc.text(sc.ord, margin + 74, y + 4.5);
    doc.text(sc.rev, margin + 108, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...sc.color);
    doc.text(sc.net, margin + 144, y + 4.5);

    y += 6.8;
  });

  y += 5.0;

  // 6. Synthesis & Executive Recommendation Card (Height: 32mm)
  doc.setFillColor(...COLORS.navyDark);
  doc.roundedRect(margin, y, contentWidth, 32, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.white);
  doc.text('EXECUTIVE SYNTHESIS & APM RECOMMENDATION', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.0);
  doc.setTextColor(226, 232, 240);
  const synthText = doc.splitTextToSize(
    'Proceed with narrow, gated Chrome Extension pilot for 25,000 desktop power shoppers upon G1 validation (≥60% restart friction). Enforce strict 50/50 ITT randomized control over 4–6 weeks. Scale only if incremental order lift clears ΔO ≥ +0.08 with dispute rates <1.5%.',
    contentWidth - 8
  );
  doc.text(synthText, margin + 4, y + 12.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(198, 220, 253);
  doc.text(`Authored by: ${candidateName} • APM Candidate`, margin + 4, y + 27);
  doc.text('Recommendation: PROCEED TO G1 DISCOVERY GATE', margin + contentWidth - 4, y + 27, { align: 'right' });

  // Footer
  drawFooter(doc, pageWidth, pageHeight, margin, 1, 1, dateStr);

  // Download Output
  const filename = `Suvam_Priyaranjan_Sahoo_CashKaro_APM_1Pager_Brief_${dateStr.replace(/[\s,]+/g, '_')}.pdf`;
  doc.save(filename);
};

/**
 * Generates an exhaustive, 12-Page Complete Strategy Dossier (100% Native Vector, DOM-Aware).
 * Ensures that all 12 sections are rendered on their own comprehensive, rich dedicated pages.
 * Inspects live DOM structure safely and integrates current innerText without ever throwing null errors.
 */
export const generateFullDossierPdf = async (
  options?: Partial<PdfExportOptions>
): Promise<void> => {
  const candidateName = options?.candidateName || 'SUVAM PRIYARANJAN SAHOO';
  const candidateEmail = options?.candidateEmail || 'sahoosuvampriyaranjan10@gmail.com';
  const onProgress = options?.onProgress || (() => {});
  const markedIds = options?.markedSectionIds || [];
  const mode = options?.mode || 'full-dossier';

  onProgress(5, 'Initializing 12-Page Vector PDF Engine & Inspecting DOM Structure...');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Define the 12 Comprehensive Case Sections
  const caseSections = [
    { num: '01', id: 'hero', title: 'Executive Summary & Decision Spine', sub: 'PART 01/12: CORE DIAGNOSIS & 7-STEP DECISION PIPELINE' },
    { num: '02', id: 'problem', title: 'The Problem Isn\'t the Feature', sub: 'PART 02/12: SHOPPING LEAKAGE MECHANISM & MOMENT OF INTENT' },
    { num: '03', id: 'hypotheses', title: 'Competing Explanations & Strategic Bets', sub: 'PART 03/12: 3 COMPETING HYPOTHESES (H1 - H3) & LEARNING LOOPS' },
    { num: '04', id: 'prioritization', title: 'Prioritization & Segment Lens', sub: 'PART 04/12: CANDIDATE DIRECTION FILTERING & TARGET COHORT' },
    { num: '05', id: 'validation', title: 'Sequential Validation Gates (G1 → G4)', sub: 'PART 05/12: 4-STAGE GATING PIPELINE & GOVERNANCE DISCIPLINE' },
    { num: '06', id: 'mind-change', title: 'What Would Change My Mind?', sub: 'PART 06/12: ZERO-DOGMA KILL CRITERIA & PIVOT TRIGGERS' },
    { num: '07', id: 'intent-router', title: 'Product Showcase: The Intent Router', sub: 'PART 07/12: DESKTOP V1 UX, FLOATING PILL & INTERACTION FLOW' },
    { num: '08', id: 'product-spec', title: 'Product Specification & Acceptance Criteria', sub: 'PART 08/12: BUILD-READY PRD, AC1-AC7 & SUPPRESSION BOUNDS' },
    { num: '09', id: 'architecture', title: 'Technical Architecture & 3-Stream Flows', sub: 'PART 09/12: DECOUPLED STREAMS, S2S POSTBACKS & FAIL-CLOSED SECURITY' },
    { num: '10', id: 'measurement', title: 'Measurement & Metric Hierarchy', sub: 'PART 10/12: 50/50 ITT EXPERIMENT DESIGN & NORTH STAR METRICS' },
    { num: '11', id: 'simulator', title: 'Financial Economics & Break-Even Simulator', sub: 'PART 11/12: BREAK-EVEN FORMULA, POWER & SENSITIVITY MATRIX' },
    { num: '12', id: 'operating-model', title: 'Operating Model, RACI & Final Decision', sub: 'PART 12/12: CROSS-FUNCTIONAL RACI, RISK MITIGATION & SYNTHESIS' },
  ];

  // If in saved-insights mode, filter to only marked sections (minimum 1 page)
  const activeSections = mode === 'saved-insights' && markedIds.length > 0
    ? caseSections.filter((s) => markedIds.includes(s.id) || (s.id === 'validation' && markedIds.includes('validation-gates')))
    : caseSections;

  const totalPages = activeSections.length;

  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    const sMeta = activeSections[pageIdx];
    const pageNumber = pageIdx + 1;
    const progressPercent = Math.round((pageNumber / totalPages) * 90) + 5;

    onProgress(progressPercent, `Parsing DOM & Rendering Page ${pageNumber} of ${totalPages}: Section ${sMeta.num} (${sMeta.title})...`);

    if (pageIdx > 0) {
      doc.addPage();
    }

    // Safely extract DOM structure and innerText content
    const domData = extractSectionDomData(sMeta.id, sMeta.title);

    // Draw standard header
    drawHeader(
      doc,
      pageWidth,
      margin,
      `CASHKARO APM STRATEGY DOSSIER • ${sMeta.title.toUpperCase()}`,
      sMeta.sub,
      candidateName,
      candidateEmail
    );

    let y = 26;

    // SECTION 01: Executive Summary & Decision Spine
    if (sMeta.id === 'hero') {
      // 1. Core Thesis Card (Height: 30mm)
      doc.setFillColor(...COLORS.lightBlueBg);
      doc.roundedRect(margin, y, contentWidth, 30, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.borderBlue);
      doc.roundedRect(margin, y, contentWidth, 30, 1.5, 1.5, 'D');

      doc.setTextColor(...COLORS.primaryBlue);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.0);
      doc.text('SECTION 01: EXECUTIVE SUMMARY & CORE ROOT-CAUSE DIAGNOSIS', margin + 4, y + 6);

      doc.setTextColor(...COLORS.textDark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      const thesis = doc.splitTextToSize(
        'Direct retailer shopping leakage is an outcome, not a fundamental diagnosis. High-frequency existing CashKaro shoppers experience severe switching friction when late recall occurs after arriving at merchant storefronts. Navigating back risks losing active carts, flash deals, and purchase momentum. The proposed consented Intent Router meets the user at the exact moment of intent, removing friction in 1 tap without page reloads or checkout disruption.',
        contentWidth - 8
      );
      doc.text(thesis, margin + 4, y + 12);

      y += 34;

      // 2. Metric Spine (4 KPI Cards, Height: 24mm)
      const boxWidth = (contentWidth - 9) / 4;
      const kpis = [
        { label: 'NORTH STAR CAUSAL LIFT', val: '+0.12 ΔO / user', sub: 'Incremental orders/user', color: COLORS.primaryBlue },
        { label: 'CAUSAL STANDARD', val: '50/50 ITT Holdout', sub: 'Persistent random control', color: COLORS.emeraldGreen },
        { label: 'Q1 TARGET MARGIN', val: '₹1.52M+ Net', sub: 'Gross contribution profit', color: COLORS.navyAccent },
        { label: 'SECURITY BOUND', val: 'Fail-Closed', sub: 'Zero checkout disruption', color: COLORS.amberAlert },
      ];

      kpis.forEach((m, idx) => {
        const x = margin + idx * (boxWidth + 3);
        doc.setFillColor(...COLORS.cardBg);
        doc.roundedRect(x, y, boxWidth, 22, 1.5, 1.5, 'F');
        doc.setDrawColor(...COLORS.cardBorder);
        doc.roundedRect(x, y, boxWidth, 22, 1.5, 1.5, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.2);
        doc.setTextColor(...COLORS.textMuted);
        doc.text(m.label, x + boxWidth / 2, y + 5, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(...m.color);
        doc.text(m.val, x + boxWidth / 2, y + 12, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(...COLORS.textMuted);
        doc.text(m.sub, x + boxWidth / 2, y + 18, { align: 'center' });
      });

      y += 26;

      // 3. 7-Step Decision Pipeline (Height: 114mm)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.0);
      doc.setTextColor(...COLORS.navyAccent);
      doc.text('THE 7-STEP APM DECISION FRAMEWORK & LEARNING LOOP', margin, y + 3.5);

      y += 5.5;

      const steps = [
        { num: '01', title: 'Observed Leakage', desc: 'Active CashKaro users navigate directly to partner retailers without tracking affiliate paths.' },
        { num: '02', title: 'Routing Hypothesis', desc: 'Users know cashback value but remember late; restarting journey introduces high cognitive switching cost.' },
        { num: '03', title: 'G1 Discovery Gate', desc: '8–10 purchase reconstructions with 2 independent blind coders (Pass threshold ≥ 60% friction).' },
        { num: '04', title: 'Intent Router Bet', desc: 'Consented Chrome extension injecting 1-tap affiliate activation on 3–5 allowlisted partner retailers.' },
        { num: '05', title: 'Persistent 50/50 ITT', desc: 'Pre-registered Intention-To-Treat randomized cohort over a 4–6 week postback attribution window.' },
        { num: '06', title: 'Incremental Orders', desc: 'North Star evaluated purely on incremental orders / eligible user (ΔO), never vanity extension clicks.' },
        { num: '07', title: 'Scale / Iterate / Kill', desc: 'Scale only if conservative contribution clears one-time build (Kf) and recurring operating costs.' },
      ];

      steps.forEach((st) => {
        doc.setFillColor(...COLORS.cardBg);
        doc.roundedRect(margin, y, contentWidth, 14.5, 1, 1, 'F');
        doc.setDrawColor(...COLORS.cardBorder);
        doc.roundedRect(margin, y, contentWidth, 14.5, 1, 1, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2);
        doc.setTextColor(...COLORS.primaryBlue);
        doc.text(`[Step ${st.num}] ${st.title}:`, margin + 3.5, y + 5.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.8);
        doc.setTextColor(...COLORS.textDark);
        doc.text(doc.splitTextToSize(st.desc, contentWidth - 48), margin + 44, y + 5.5);

        y += 16.0;
      });

      y += 2;

      // 4. Recruiter Brief Callout (Height: 46mm)
      doc.setFillColor(...COLORS.purpleBg);
      doc.roundedRect(margin, y, contentWidth, 42, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.purpleBorder);
      doc.roundedRect(margin, y, contentWidth, 42, 1.5, 1.5, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.setTextColor(...COLORS.purpleAccent);
      doc.text('CANDIDATE COMPETENCY HIGHLIGHT: FIRST-PRINCIPLES APM RIGOR', margin + 4, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(...COLORS.textDark);
      doc.text(
        doc.splitTextToSize(
          'This case study demonstrates end-to-end product mastery: isolating causal mechanisms from surface symptoms, establishing falsifiable behavioral gates, enforcing fail-closed privacy bounds, and modeling break-even financial sensitivity under stress scenarios.',
          contentWidth - 8
        ),
        margin + 4,
        y + 13
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.0);
      doc.setTextColor(...COLORS.navyAccent);
      doc.text('• Core Competencies: Behavioral Gating • Causal Inference • Unit Economics • Non-Invasive UX Architecture', margin + 4, y + 34);
    }

    // SECTION 02: The Problem Isn't the Feature
    else if (sMeta.id === 'problem') {
      doc.setFillColor(...COLORS.lightBlueBg);
      doc.roundedRect(margin, y, contentWidth, 28, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.borderBlue);
      doc.roundedRect(margin, y, contentWidth, 28, 1.5, 1.5, 'D');

      doc.setTextColor(...COLORS.primaryBlue);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.0);
      doc.text('SECTION 02: THE REAL SHOPPING LEAKAGE MECHANISM', margin + 4, y + 6);

      doc.setTextColor(...COLORS.textDark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      const probOverview = doc.splitTextToSize(
        'Shopping is non-linear and fragmented. Users land on e-commerce storefronts directly from WhatsApp links, Google search queries, price comparison notifications, and direct navigation. When late recall occurs, forcing the user to return to CashKaro introduces unacceptable cognitive and operational friction.',
        contentWidth - 8
      );
      doc.text(probOverview, margin + 4, y + 12);

      y += 32;

      // The 3-Stage Drop-Off Breakdown (Height: 104mm)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.0);
      doc.setTextColor(...COLORS.navyAccent);
      doc.text('THE 3-STAGE MOMENT-OF-INTENT DROP-OFF FUNNEL', margin, y + 3.5);

      y += 5.5;

      const funnelStages = [
        {
          num: 'Stage 1',
          name: 'Direct Merchant Arrival',
          trigger: 'User clicks external ad, deal alert, or enters retailer URL directly',
          friction: 'CashKaro is completely bypassed; user has zero active affiliate session token.',
          leakage: '42% of existing active users exhibit direct shopping behavior weekly.',
          color: COLORS.amberAlert,
        },
        {
          num: 'Stage 2',
          name: 'Late Cashback Recall',
          trigger: 'User adds items to cart and remembers cashback earnings at checkout',
          friction: 'Switching back to CashKaro requires leaving the retailer and re-searching items.',
          leakage: '68% of users report cart-loss anxiety as reason for abandoning switch-back.',
          color: COLORS.primaryBlue,
        },
        {
          num: 'Stage 3',
          name: 'Un-Tracked Purchase & Churn',
          trigger: 'User completes checkout directly on retailer storefront',
          friction: 'User experiences post-purchase regret or friction claiming missing cashback.',
          leakage: 'Eats platform margin and reduces long-term cohort shopping frequency.',
          color: COLORS.redAlert,
        },
      ];

      funnelStages.forEach((fs) => {
        doc.setFillColor(...COLORS.cardBg);
        doc.roundedRect(margin, y, contentWidth, 31, 1.5, 1.5, 'F');
        doc.setDrawColor(...COLORS.cardBorder);
        doc.roundedRect(margin, y, contentWidth, 31, 1.5, 1.5, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.0);
        doc.setTextColor(...fs.color);
        doc.text(`[${fs.num}] ${fs.name}`, margin + 4, y + 6);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.8);
        doc.setTextColor(...COLORS.navyAccent);
        doc.text('Trigger:', margin + 4, y + 12);
        doc.text('Friction Point:', margin + 4, y + 18);
        doc.text('Leakage Impact:', margin + 4, y + 24);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.8);
        doc.setTextColor(...COLORS.textDark);
        doc.text(fs.trigger, margin + 30, y + 12);
        doc.text(fs.friction, margin + 30, y + 18);
        doc.text(fs.leakage, margin + 30, y + 24);

        y += 34;
      });

      y += 3;

      // The Habit Paradox Card (Height: 48mm)
      doc.setFillColor(...COLORS.emeraldBg);
      doc.roundedRect(margin, y, contentWidth, 44, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.emeraldBorder);
      doc.roundedRect(margin, y, contentWidth, 44, 1.5, 1.5, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...COLORS.emeraldGreen);
      doc.text('KEY STRATEGIC INSIGHT: THE WALLET-BALANCE PARADOX', margin + 4, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(...COLORS.textDark);
      const paradox = doc.splitTextToSize(
        'Data reveals that >40% of un-tracked direct retailer visits originate from users with positive, withdrawable cashback balances who actively redeemed earnings within the last 90 days. This decisively proves that leakage is NOT caused by disbelief in value or lack of brand affinity. It is purely a physical routing and switching cost problem.',
        contentWidth - 8
      );
      doc.text(paradox, margin + 4, y + 13);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.0);
      doc.setTextColor(...COLORS.navyAccent);
      doc.text('• Root Cause Confirmation: High Willingness-to-Earn + High Switching-Friction = Leaked Transactions.', margin + 4, y + 36);
    }

    // SECTION 03: Competing Explanations & Hypotheses
    else if (sMeta.id === 'hypotheses') {
      doc.setFillColor(...COLORS.lightBlueBg);
      doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.borderBlue);
      doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'D');

      doc.setTextColor(...COLORS.primaryBlue);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.0);
      doc.text('SECTION 03: 3 COMPETING HYPOTHESES & STRATEGIC BETS', margin + 4, y + 6);

      doc.setTextColor(...COLORS.textDark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.text(
        'Before committing engineering resources, we framed 3 mutually exclusive hypotheses to explain direct shopping leakage, detailing why we believe them, what would prove them, and what would disprove them.',
        margin + 4,
        y + 12,
        { maxWidth: contentWidth - 8 }
      );

      y += 30;

      // 3 Hypotheses Cards (Height: 54mm each = 162mm)
      HYPOTHESES.forEach((h) => {
        const isSelected = h.isSelected;
        const cardHeight = 52;
        doc.setFillColor(isSelected ? 235 : 248, isSelected ? 242 : 250, isSelected ? 254 : 252);
        doc.roundedRect(margin, y, contentWidth, cardHeight, 1.5, 1.5, 'F');
        doc.setDrawColor(isSelected ? 198 : 226, isSelected ? 220 : 232, isSelected ? 253 : 240);
        doc.roundedRect(margin, y, contentWidth, cardHeight, 1.5, 1.5, 'D');

        // Name & Tag
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(isSelected ? 49 : 100, isSelected ? 107 : 116, isSelected ? 234 : 139);
        doc.text(`${h.name} — ${h.subtitle}`, margin + 4, y + 6);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2);
        doc.text(`[${h.tag}]`, margin + contentWidth - 4, y + 6, { align: 'right' });

        // Body fields
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.8);
        doc.setTextColor(...COLORS.navyAccent);
        doc.text('Why We Believe:', margin + 4, y + 13);
        doc.text('What Would Prove:', margin + 4, y + 23);
        doc.text('What Would Disprove:', margin + 4, y + 33);
        doc.text('Product Implication:', margin + 4, y + 43);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.8);
        doc.setTextColor(...COLORS.textDark);
        doc.text(doc.splitTextToSize(h.whyWeBelieve, contentWidth - 38), margin + 34, y + 13);
        doc.text(doc.splitTextToSize(h.whatWouldProve, contentWidth - 38), margin + 34, y + 23);
        doc.text(doc.splitTextToSize(h.whatWouldDisprove, contentWidth - 38), margin + 34, y + 33);
        doc.text(doc.splitTextToSize(h.productImplication, contentWidth - 38), margin + 34, y + 43);

        y += cardHeight + 4.5;
      });
    }

    // SECTION 04: Prioritization & Segment Lens
    else if (sMeta.id === 'prioritization') {
      doc.setFillColor(...COLORS.lightBlueBg);
      doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.borderBlue);
      doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'D');

      doc.setTextColor(...COLORS.primaryBlue);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.0);
      doc.text('SECTION 04: PRIORITIZATION FRAMEWORK & STRATEGIC FILTERING', margin + 4, y + 6);

      doc.setTextColor(...COLORS.textDark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.text(
        'Evaluated 5 candidate product interventions across moment of intent, causality, addressability, and reversibility to select the highest-yield, lowest-risk V1 bet.',
        margin + 4,
        y + 12,
        { maxWidth: contentWidth - 8 }
      );

      y += 28;

      // Table Header
      doc.setFillColor(...COLORS.slateHeader);
      doc.rect(margin, y, contentWidth, 6.0, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(71, 85, 105);
      doc.text('CANDIDATE DIRECTION', margin + 2, y + 4.2);
      doc.text('PRIMARY MOMENT', margin + 46, y + 4.2);
      doc.text('CAUSALITY', margin + 94, y + 4.2);
      doc.text('REVERSIBILITY', margin + 122, y + 4.2);
      doc.text('DECISION & STATUS', margin + 150, y + 4.2);

      y += 6.0;

      PRIORITIZATION_DIRECTIONS.forEach((p) => {
        const isSelected = p.status.includes('SELECTED');
        doc.setFillColor(isSelected ? 235 : 255, isSelected ? 242 : 255, isSelected ? 254 : 255);
        doc.rect(margin, y, contentWidth, 18.0, 'F');
        doc.setDrawColor(...COLORS.cardBorder);
        doc.line(margin, y + 18.0, margin + contentWidth, y + 18.0);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2);
        doc.setTextColor(isSelected ? 49 : 30, isSelected ? 107 : 41, isSelected ? 234 : 59);
        doc.text(p.name, margin + 2, y + 5.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.8);
        doc.setTextColor(...COLORS.textMuted);
        doc.text(p.primaryMoment, margin + 46, y + 5.5);
        doc.text(p.causality, margin + 94, y + 5.5);
        doc.text(p.reversibility, margin + 122, y + 5.5);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(isSelected ? 49 : 100, isSelected ? 107 : 116, isSelected ? 234 : 139);
        doc.text(p.status, margin + 150, y + 5.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(...COLORS.textDark);
        doc.text(doc.splitTextToSize(p.rationale, 136), margin + 46, y + 11);

        y += 18.0;
      });

      y += 6;

      // Pilot Segment Cohort Box (Height: 52mm)
      doc.setFillColor(...COLORS.cardBg);
      doc.roundedRect(margin, y, contentWidth, 48, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.cardBorder);
      doc.roundedRect(margin, y, contentWidth, 48, 1.5, 1.5, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...COLORS.navyAccent);
      doc.text('TARGET SEGMENT SELECTION: 25,000 DESKTOP HIGH-FREQUENCY SHOPPERS', margin + 4, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(...COLORS.textDark);
      const segmentText = doc.splitTextToSize(
        'The V1 pilot is strictly restricted to desktop power shoppers (≥2 purchases/quarter on top 3–5 allowlisted partner retailers like Amazon, Flipkart, Myntra, Ajio). This cohort exhibits high desktop AOV, predictable repurchasing schedules, and low extension installation friction, giving the cleanest causal test of intent routing before expanding to mobile web or app surfaces.',
        contentWidth - 8
      );
      doc.text(segmentText, margin + 4, y + 13);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.0);
      doc.setTextColor(...COLORS.primaryBlue);
      doc.text('• Selection Criteria: Desktop Chrome • ≥2 Purchases/Quarter • Opt-in Consent • Allowlisted Merchants Only', margin + 4, y + 38);
    }

    // SECTION 05: Validation Gates (G1 → G4)
    else if (sMeta.id === 'validation') {
      doc.setFillColor(...COLORS.lightBlueBg);
      doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.borderBlue);
      doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'D');

      doc.setTextColor(...COLORS.primaryBlue);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.0);
      doc.text('SECTION 05: 4-STAGE SEQUENTIAL VALIDATION GATES', margin + 4, y + 6);

      doc.setTextColor(...COLORS.textDark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.text(
        'Each gate has a concrete organizational cost. We halt engineering capacity on any feature until preceding behavioral uncertainties are systematically proven.',
        margin + 4,
        y + 12,
        { maxWidth: contentWidth - 8 }
      );

      y += 28;

      // 4 Expanded Validation Gates (Height: 44mm each = 176mm)
      VALIDATION_GATES.forEach((g) => {
        doc.setFillColor(...COLORS.cardBg);
        doc.roundedRect(margin, y, contentWidth, 42, 1.5, 1.5, 'F');
        doc.setDrawColor(...COLORS.cardBorder);
        doc.roundedRect(margin, y, contentWidth, 42, 1.5, 1.5, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...COLORS.emeraldGreen);
        doc.text(`[${g.gate}] ${g.title}`, margin + 4, y + 6);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2);
        doc.setTextColor(...COLORS.textMuted);
        doc.text(`TARGET: ${g.metricTarget}`, margin + contentWidth - 4, y + 6, { align: 'right' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.8);
        doc.setTextColor(...COLORS.navyAccent);
        doc.text('Methodology:', margin + 4, y + 14);
        doc.text('Pass Condition:', margin + 4, y + 23);
        doc.text('If Fails / Action:', margin + 4, y + 32);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.8);
        doc.setTextColor(...COLORS.textDark);
        doc.text(doc.splitTextToSize(g.method, contentWidth - 36), margin + 32, y + 14);
        doc.text(doc.splitTextToSize(g.passCondition, contentWidth - 36), margin + 32, y + 23);
        doc.text(doc.splitTextToSize(g.ifFails, contentWidth - 36), margin + 32, y + 32);

        y += 45.0;
      });

      y += 2;

      // Gating Economics Box (Height: 30mm)
      doc.setFillColor(...COLORS.lightBlueBg);
      doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.borderBlue);
      doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...COLORS.primaryBlue);
      doc.text('GOVERNANCE PRINCIPLE: SEQUENTIAL CAPITAL DEPLOYMENT', margin + 4, y + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(...COLORS.textDark);
      doc.text(
        'Zero engineering build occurs until G1 confirms restart friction in qualitative interviews. Zero scaled marketing spend occurs until G4 confirms incremental orders per user exceed the break-even threshold.',
        margin + 4,
        y + 12,
        { maxWidth: contentWidth - 8 }
      );
    }

    // SECTION 06: What Would Change My Mind?
    else if (sMeta.id === 'mind-change') {
      doc.setFillColor(...COLORS.lightBlueBg);
      doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.borderBlue);
      doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'D');

      doc.setTextColor(...COLORS.primaryBlue);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.0);
      doc.text('SECTION 06: ZERO-DOGMA KILL CRITERIA & PIVOT TRIGGERS', margin + 4, y + 6);

      doc.setTextColor(...COLORS.textDark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.text(
        'Product leadership requires intellectual honesty. Below are 5 explicit scenarios where data would disprove the thesis, triggering immediate cancellation or pivot.',
        margin + 4,
        y + 12,
        { maxWidth: contentWidth - 8 }
      );

      y += 28;

      // 5 Kill Trigger Cards (Height: 33mm each = 165mm)
      MIND_CHANGE_SCENARIOS.forEach((sc) => {
        doc.setFillColor(...COLORS.redBg);
        doc.roundedRect(margin, y, contentWidth, 31, 1.5, 1.5, 'F');
        doc.setDrawColor(...COLORS.redBorder);
        doc.roundedRect(margin, y, contentWidth, 31, 1.5, 1.5, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.0);
        doc.setTextColor(...COLORS.redAlert);
        doc.text(`KILL TRIGGER: ${sc.title}`, margin + 4, y + 6);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.8);
        doc.setTextColor(...COLORS.navyAccent);
        doc.text('Failure Signal:', margin + 4, y + 13);
        doc.text('Executive Action:', margin + 4, y + 21);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.8);
        doc.setTextColor(...COLORS.textDark);
        doc.text(doc.splitTextToSize(sc.trigger, contentWidth - 36), margin + 32, y + 13);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.redAlert);
        doc.text(doc.splitTextToSize(sc.pivotAction, contentWidth - 36), margin + 32, y + 21);

        y += 33.5;
      });

      y += 2;

      // Capital Redistribution Guarantee (Height: 34mm)
      doc.setFillColor(...COLORS.cardBg);
      doc.roundedRect(margin, y, contentWidth, 30, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.cardBorder);
      doc.roundedRect(margin, y, contentWidth, 30, 1.5, 1.5, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...COLORS.navyAccent);
      doc.text('POST-KILL RESOURCE & CAPITAL REDISTRIBUTION PROTOCOL', margin + 4, y + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(...COLORS.textDark);
      doc.text(
        'If any kill trigger fires, engineering resources are immediately reassigned to Direction 2 (Trust & Reliability Guardrails) within 48 hours. No sunk cost fallacy will delay product pivots.',
        margin + 4,
        y + 12,
        { maxWidth: contentWidth - 8 }
      );
    }

    // SECTION 07: Product Showcase: The Intent Router
    else if (sMeta.id === 'intent-router') {
      doc.setFillColor(...COLORS.lightBlueBg);
      doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.borderBlue);
      doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'D');

      doc.setTextColor(...COLORS.primaryBlue);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.0);
      doc.text('SECTION 07: PRODUCT SHOWCASE — THE V1 INTENT ROUTER', margin + 4, y + 6);

      doc.setTextColor(...COLORS.textDark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.text(
        'Lightweight, consented Chrome extension designed with 4 inviolable principles: 1 clear value statement, explicit 1-tap activation, zero page reload, and zero disturbance to cart state.',
        margin + 4,
        y + 12,
        { maxWidth: contentWidth - 8 }
      );

      y += 30;

      // 4 UX Spec Cards (Height: 38mm each = 152mm)
      const uxSpecs = [
        {
          num: '01',
          title: 'Passive URL Detection & Sub-5ms Match',
          desc: 'Lightweight content script detects allowlisted merchant URLs locally via regex in <5ms. Collects zero page contents, passwords, or unrelated URLs.',
          badge: 'Silent Detection',
        },
        {
          num: '02',
          title: 'Unobtrusive Floating Pill & Clear Rate',
          desc: 'Pill slides smoothly in from top-right with clear rate: "Activate 4.5% Cashback on Amazon". Non-blocking, easy dismiss with persistent snooze.',
          badge: '0.3s Transition',
        },
        {
          num: '03',
          title: '1-Tap Background Handshake & Zero Reload',
          desc: 'Click triggers background tab handshake with CashKaro API to generate Click ID without refreshing the retailer page or dropping active carts.',
          badge: 'Zero Reload',
        },
        {
          num: '04',
          title: 'Precedence & Fail-Closed Safety Lock',
          desc: 'Suppressed on checkout, login, & payment gateways. If 3rd-party affiliate cookie exists, extension backs off immediately (Fail-Closed).',
          badge: 'Fail-Closed Guard',
        },
      ];

      uxSpecs.forEach((ux) => {
        doc.setFillColor(...COLORS.cardBg);
        doc.roundedRect(margin, y, contentWidth, 35, 1.5, 1.5, 'F');
        doc.setDrawColor(...COLORS.cardBorder);
        doc.roundedRect(margin, y, contentWidth, 35, 1.5, 1.5, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...COLORS.primaryBlue);
        doc.text(`[${ux.num}] ${ux.title}`, margin + 4, y + 6);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2);
        doc.setTextColor(...COLORS.emeraldGreen);
        doc.text(`[${ux.badge}]`, margin + contentWidth - 4, y + 6, { align: 'right' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.0);
        doc.setTextColor(...COLORS.textDark);
        doc.text(doc.splitTextToSize(ux.desc, contentWidth - 8), margin + 4, y + 14);

        y += 38.0;
      });

      y += 2;

      // User State Machine Diagram Box (Height: 46mm)
      doc.setFillColor(...COLORS.navyDark);
      doc.roundedRect(margin, y, contentWidth, 42, 1.5, 1.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...COLORS.white);
      doc.text('INTENT ROUTER STATE MACHINE & USER LIFECYCLE', margin + 4, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.0);
      doc.setTextColor(226, 232, 240);
      doc.text(
        '1. Domain Match -> 2. Pill Exposure -> 3. User 1-Tap -> 4. S2S Handshake -> 5. Active Badge Confirmation',
        margin + 4,
        y + 14
      );
      doc.text(
        'If user dismisses -> Suppress for 24 hours on domain. If user completes checkout -> S2S postback confirms order tracking.',
        margin + 4,
        y + 24
      );
    }

    // SECTION 08: Product Specification & Acceptance Criteria
    else if (sMeta.id === 'product-spec') {
      doc.setFillColor(...COLORS.lightBlueBg);
      doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.borderBlue);
      doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'D');

      doc.setTextColor(...COLORS.primaryBlue);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.0);
      doc.text('SECTION 08: BUILD-READY PRD & ACCEPTANCE CRITERIA (AC1 — AC7)', margin + 4, y + 6);

      doc.setTextColor(...COLORS.textDark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.text(
        'Comprehensive technical product requirements for engineers, QA, and security auditors. Covers happy paths, edge cases, and suppression rules.',
        margin + 4,
        y + 12,
        { maxWidth: contentWidth - 8 }
      );

      y += 28;

      // Acceptance Criteria Table Header
      doc.setFillColor(...COLORS.slateHeader);
      doc.rect(margin, y, contentWidth, 6.0, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(71, 85, 105);
      doc.text('ID', margin + 2, y + 4.2);
      doc.text('CRITERIA TITLE', margin + 14, y + 4.2);
      doc.text('CATEGORY', margin + 70, y + 4.2);
      doc.text('SPECIFICATION & VERIFICATION REQUIREMENT', margin + 102, y + 4.2);

      y += 6.0;

      // 7 Acceptance Criteria (Height: 22mm each = 154mm)
      ACCEPTANCE_CRITERIA.forEach((ac, idx) => {
        doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
        doc.rect(margin, y, contentWidth, 20.0, 'F');
        doc.setDrawColor(...COLORS.cardBorder);
        doc.line(margin, y + 20.0, margin + contentWidth, y + 20.0);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2);
        doc.setTextColor(...COLORS.primaryBlue);
        doc.text(ac.id, margin + 2, y + 5.5);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.textDark);
        doc.text(ac.title, margin + 14, y + 5.5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.8);
        doc.setTextColor(...COLORS.emeraldGreen);
        doc.text(`[${ac.category}]`, margin + 70, y + 5.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(...COLORS.textDark);
        doc.text(doc.splitTextToSize(ac.description, contentWidth - 106), margin + 102, y + 5.5);

        y += 20.0;
      });

      y += 6;

      // Non-Functional Compliance Box (Height: 46mm)
      doc.setFillColor(...COLORS.cardBg);
      doc.roundedRect(margin, y, contentWidth, 42, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.cardBorder);
      doc.roundedRect(margin, y, contentWidth, 42, 1.5, 1.5, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.0);
      doc.setTextColor(...COLORS.navyAccent);
      doc.text('NON-FUNCTIONAL REQUIREMENTS & CHROME STORE COMPLIANCE', margin + 4, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(...COLORS.textDark);
      doc.text(
        '• Memory Footprint: Extension background worker memory must not exceed 15MB at any time.\n• Latency SLA: Merchant URL regex matching must execute in under 5ms without blocking main thread DOM rendering.\n• Compliance: Meets Manifest V3 single-purpose policy, requesting only activeTab and declarativeNetRequest permissions.',
        margin + 4,
        y + 13,
        { maxWidth: contentWidth - 8 }
      );
    }

    // SECTION 09: Technical Architecture & Flows
    else if (sMeta.id === 'architecture') {
      doc.setFillColor(...COLORS.lightBlueBg);
      doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.borderBlue);
      doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'D');

      doc.setTextColor(...COLORS.primaryBlue);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.0);
      doc.text('SECTION 09: 3-STREAM DECOUPLED TECHNICAL ARCHITECTURE', margin + 4, y + 6);

      doc.setTextColor(...COLORS.textDark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.text(
        'Decoupled into 3 independent execution streams to maximize reliability, maintain sub-50ms latency, prevent merchant site conflicts, and ensure robust S2S reconciliation.',
        margin + 4,
        y + 12,
        { maxWidth: contentWidth - 8 }
      );

      y += 30;

      // 3 Streams (Height: 48mm each = 144mm)
      const archStreams = [
        {
          stream: 'Stream 1: Client Surface & Event Bus (Chrome Manifest V3)',
          desc: 'Chrome Extension Content Script monitors URL changes locally. Emits passive intent event only upon matching allowlisted partner domain. Zero DOM scraping of customer personal details.',
          specs: ['Local URL regex match (<5ms)', 'Manifest V3 compliant background worker', 'Secure cross-origin messaging bus'],
        },
        {
          stream: 'Stream 2: Server-Side Policy & Attribution Engine',
          desc: 'Central CashKaro Policy Engine validates user eligibility, merchant campaign status, and referral parameter precedence. Generates ephemeral cryptographic click tokens.',
          specs: ['Opaque policy evaluation', 'Existing affiliate precedence lock (Fail-Closed)', 'S2S token generation & tracking session bind'],
        },
        {
          stream: 'Stream 3: Partner S2S Postback & Reconciliation Ledger',
          desc: 'Merchant network fires Server-to-Server postback upon order completion. Reconciliation engine joins order ID with logged click token and updates user ledger balance.',
          specs: ['Asynchronous postback ingestion', 'Automated deduplication & fraud filtering', '48-hour tracking SLA reconciliation'],
        },
      ];

      archStreams.forEach((as) => {
        doc.setFillColor(...COLORS.cardBg);
        doc.roundedRect(margin, y, contentWidth, 44, 1.5, 1.5, 'F');
        doc.setDrawColor(...COLORS.cardBorder);
        doc.roundedRect(margin, y, contentWidth, 44, 1.5, 1.5, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.2);
        doc.setTextColor(...COLORS.primaryBlue);
        doc.text(as.stream, margin + 4, y + 6);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.0);
        doc.setTextColor(...COLORS.textDark);
        doc.text(doc.splitTextToSize(as.desc, contentWidth - 8), margin + 4, y + 13);

        let specX = margin + 4;
        as.specs.forEach((sp) => {
          doc.setFillColor(...COLORS.lightBlueBg);
          doc.roundedRect(specX, y + 30, (contentWidth - 14) / 3, 9.0, 1, 1, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(6.2);
          doc.setTextColor(...COLORS.primaryBlue);
          doc.text(sp, specX + 2, y + 36);
          specX += (contentWidth - 14) / 3 + 3.5;
        });

        y += 48;
      });

      y += 3;

      // Security Card (Height: 52mm)
      doc.setFillColor(...COLORS.emeraldBg);
      doc.roundedRect(margin, y, contentWidth, 46, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.emeraldBorder);
      doc.roundedRect(margin, y, contentWidth, 46, 1.5, 1.5, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...COLORS.emeraldGreen);
      doc.text('SECURITY, PRIVACY & FAIL-CLOSED INTEGRITY GUARANTEES', margin + 4, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(...COLORS.textDark);
      doc.text(
        doc.splitTextToSize(
          'Zero capture of passwords, payment credentials, or cart contents. Precedence rules ensure existing creator and organic cookies are never overwritten. A remote server-side kill switch allows disabling the extension across all users in <60 seconds in case of retailer API deprecation.',
          contentWidth - 8
        ),
        margin + 4,
        y + 14
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.0);
      doc.setTextColor(...COLORS.navyAccent);
      doc.text('• Fail-Closed Guarantee: Respect Organic Precedence • Zero Data Scraping • 60s Global Kill Switch', margin + 4, y + 38);
    }

    // SECTION 10: Measurement & Metric Hierarchy
    else if (sMeta.id === 'measurement') {
      doc.setFillColor(...COLORS.lightBlueBg);
      doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.borderBlue);
      doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'D');

      doc.setTextColor(...COLORS.primaryBlue);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.0);
      doc.text('SECTION 10: MEASUREMENT FRAMEWORK & 50/50 ITT EXPERIMENT DESIGN', margin + 4, y + 6);

      doc.setTextColor(...COLORS.textDark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.text(
        'Avoids vanity metrics by establishing a clear 3-tier metric hierarchy: North Star Causal Lift, Funnel Diagnostic Metrics, and Launch Guardrail Constraints.',
        margin + 4,
        y + 12,
        { maxWidth: contentWidth - 8 }
      );

      y += 30;

      // 3 Metrics (Height: 42mm each = 126mm)
      const metricHierarchy = [
        {
          tier: 'TIER 1: NORTH STAR METRIC',
          metric: 'Incremental Tracked Orders / Eligible User (ΔO)',
          target: '+0.12 ΔO / user (Min: +0.08)',
          desc: 'Measured strictly via 50/50 Intention-To-Treat persistent holdout over 4–6 week postback window. Never rely on raw extension click-assisted numbers.',
          color: COLORS.primaryBlue,
        },
        {
          tier: 'TIER 2: DIAGNOSTIC FUNNEL METRICS',
          metric: 'Prompt CTR, Handshake Success %, S2S Match %',
          target: 'CTR ≥65% | Handshake ≥98% | Match ≥98.5%',
          desc: 'Pinpoints exact drop-off points between intent prompt exposure, background token injection, and merchant reconciliation postback.',
          color: COLORS.navyAccent,
        },
        {
          tier: 'TIER 3: LAUNCH GUARDRAILS',
          metric: 'Partner Dispute Rate, Uninstall %, Retention Parity',
          target: 'Disputes <1.5% | Uninstalls <0.8%',
          desc: 'Protects commercial relationships, prevents user annoyance, and verifies that overall platform retention is unaffected or improved.',
          color: COLORS.emeraldGreen,
        },
      ];

      metricHierarchy.forEach((mh) => {
        doc.setFillColor(...COLORS.cardBg);
        doc.roundedRect(margin, y, contentWidth, 38, 1.5, 1.5, 'F');
        doc.setDrawColor(...COLORS.cardBorder);
        doc.roundedRect(margin, y, contentWidth, 38, 1.5, 1.5, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(...mh.color);
        doc.text(mh.tier, margin + 4, y + 6);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.2);
        doc.setTextColor(...COLORS.navyAccent);
        doc.text(mh.metric, margin + 4, y + 14);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2);
        doc.setTextColor(...COLORS.emeraldGreen);
        doc.text(`[Target: ${mh.target}]`, margin + contentWidth - 4, y + 14, { align: 'right' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.8);
        doc.setTextColor(...COLORS.textDark);
        doc.text(doc.splitTextToSize(mh.desc, contentWidth - 8), margin + 4, y + 22);

        y += 42;
      });

      y += 3;

      // ITT Box (Height: 52mm)
      doc.setFillColor(...COLORS.lightBlueBg);
      doc.roundedRect(margin, y, contentWidth, 46, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.borderBlue);
      doc.roundedRect(margin, y, contentWidth, 46, 1.5, 1.5, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...COLORS.primaryBlue);
      doc.text('WHY 50/50 ITT (INTENTION-TO-TREAT) IS REQUIRED', margin + 4, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(...COLORS.textDark);
      doc.text(
        doc.splitTextToSize(
          'Self-selection bias invalidates naive "users who installed vs users who did not" comparisons because power users naturally install extensions and shop more. A pre-registered 50/50 ITT randomly assigns users regardless of install status, providing an unassailable causal baseline.',
          contentWidth - 8
        ),
        margin + 4,
        y + 14
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.0);
      doc.setTextColor(...COLORS.navyAccent);
      doc.text('• Experimental Rigor: True Randomized Holdout • Pre-Registered Bounds • Causal Incrementality', margin + 4, y + 38);
    }

    // SECTION 11: Interactive Economics & Power Simulator
    else if (sMeta.id === 'simulator') {
      doc.setFillColor(...COLORS.lightBlueBg);
      doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.borderBlue);
      doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'D');

      doc.setTextColor(...COLORS.primaryBlue);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.0);
      doc.text('SECTION 11: FINANCIAL BREAK-EVEN FORMULA & ECONOMIC SENSITIVITY', margin + 4, y + 6);

      doc.setTextColor(...COLORS.textDark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.text(
        'Mathematical break-even sensitivity model across 25,000 eligible pilot users to guarantee that the investment delivers positive net contribution profit under severe stress conditions.',
        margin + 4,
        y + 12,
        { maxWidth: contentWidth - 8 }
      );

      y += 30;

      // Formula Callout Box (Height: 46mm)
      doc.setFillColor(...COLORS.cardBg);
      doc.roundedRect(margin, y, contentWidth, 42, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.cardBorder);
      doc.roundedRect(margin, y, contentWidth, 42, 1.5, 1.5, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.0);
      doc.setTextColor(...COLORS.primaryBlue);
      doc.text('BREAK-EVEN CAUSAL LIFT FORMULA:  ΔO_be = (Kf + Kr1) / (E * C)', margin + 4, y + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(...COLORS.textDark);
      doc.text(
        'Where Kf = Fixed build cost (₹1.25L), Kr1 = Q1 maintenance (₹20k), E = 25,000 eligible pilot users, C = ₹240 net margin per incremental order.',
        margin + 4,
        y + 16
      );
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.8);
      doc.setTextColor(...COLORS.emeraldGreen);
      doc.text(
        'Result: Required Break-Even Lift = +0.024 orders/user. Target lift of +0.12 provides a 5.0x safety margin against downside variance.',
        margin + 4,
        y + 26
      );

      y += 48;

      // Sensitivity Scenarios Table (Height: 82mm)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.0);
      doc.setTextColor(...COLORS.navyAccent);
      doc.text('PILOT & SCALE SENSITIVITY SCENARIO TABLE', margin, y + 3.5);

      y += 5.5;

      doc.setFillColor(...COLORS.slateHeader);
      doc.rect(margin, y, contentWidth, 6.0, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(71, 85, 105);
      doc.text('SCENARIO', margin + 3, y + 4.2);
      doc.text('CAUSAL LIFT (ΔO)', margin + 42, y + 4.2);
      doc.text('INCR. ORDERS', margin + 78, y + 4.2);
      doc.text('GROSS COMMISSIONS', margin + 112, y + 4.2);
      doc.text('NET CONTRIBUTION PROFIT', margin + 148, y + 4.2);

      y += 6.0;

      const simScenarios = [
        { name: 'Stress Case (Low Lift)', lift: '+0.04 orders', ord: '1,000', rev: '₹2.40L', net: '₹1.15L (Break-even +)', color: COLORS.textMuted },
        { name: 'Base Model (Target)', lift: '+0.12 orders', ord: '3,000', rev: '₹7.20L', net: '₹5.45L Net Margin', color: COLORS.primaryBlue },
        { name: 'High AOV / Electronics', lift: '+0.15 orders', ord: '3,750', rev: '₹18.00L', net: '₹14.25L Net Margin', color: COLORS.emeraldGreen },
        { name: 'Full Scale (250k Users)', lift: '+0.12 orders', ord: '30,000', rev: '₹72.00L', net: '₹58.50L Net Margin', color: COLORS.purpleAccent },
      ];

      simScenarios.forEach((sc, i) => {
        doc.setFillColor(i === 1 ? 235 : 255, i === 1 ? 242 : 255, i === 1 ? 254 : 255);
        doc.rect(margin, y, contentWidth, 12.0, 'F');
        doc.setDrawColor(...COLORS.cardBorder);
        doc.line(margin, y + 12.0, margin + contentWidth, y + 12.0);

        doc.setFont('helvetica', i === 1 ? 'bold' : 'normal');
        doc.setFontSize(7.2);
        doc.setTextColor(...COLORS.textDark);
        doc.text(sc.name, margin + 3, y + 7.5);
        doc.text(sc.lift, margin + 42, y + 7.5);
        doc.text(sc.ord, margin + 78, y + 7.5);
        doc.text(sc.rev, margin + 112, y + 7.5);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...sc.color);
        doc.text(sc.net, margin + 148, y + 7.5);

        y += 12.0;
      });

      y += 6;

      // Economic Summary Card (Height: 38mm)
      doc.setFillColor(...COLORS.cardBg);
      doc.roundedRect(margin, y, contentWidth, 34, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.cardBorder);
      doc.roundedRect(margin, y, contentWidth, 34, 1.5, 1.5, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...COLORS.navyAccent);
      doc.text('ECONOMIC TAKEAWAY: CAPITAL EFFICIENCY & RETURN ON EFFORT', margin + 4, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(...COLORS.textDark);
      doc.text(
        'Even under the most conservative stress conditions (+0.04 lift), the pilot fully recoups all development and operational overhead within 60 days, delivering a 1.79x return on capital with zero risk of negative unit economics.',
        margin + 4,
        y + 13,
        { maxWidth: contentWidth - 8 }
      );
    }

    // SECTION 12 & 13: Operating Model, RACI & Final Product Decision
    else if (sMeta.id === 'operating-model') {
      doc.setFillColor(...COLORS.lightBlueBg);
      doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'F');
      doc.setDrawColor(...COLORS.borderBlue);
      doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'D');

      doc.setTextColor(...COLORS.primaryBlue);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.0);
      doc.text('SECTION 12 & 13: OPERATING MODEL, RACI & FINAL PRODUCT DECISION', margin + 4, y + 6);

      doc.setTextColor(...COLORS.textDark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.text(
        'Cross-functional operational governance structure paired with the final APM investment synthesis and rollout mandates.',
        margin + 4,
        y + 12,
        { maxWidth: contentWidth - 8 }
      );

      y += 28;

      // RACI Matrix Table Header
      doc.setFillColor(...COLORS.slateHeader);
      doc.rect(margin, y, contentWidth, 6.0, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(71, 85, 105);
      doc.text('ROLE / FUNCTION', margin + 3, y + 4.2);
      doc.text('ACCOUNTABILITY', margin + 46, y + 4.2);
      doc.text('KEY DELIVERABLE', margin + 102, y + 4.2);
      doc.text('STATUS & CADENCE', margin + 150, y + 4.2);

      y += 6.0;

      const raciRows = [
        { role: 'Product Lead (APM)', acc: 'Problem Discovery & Gating', deliv: 'G1-G4 PRD & 50/50 ITT Spec', stat: 'Lead • Daily / Weekly' },
        { role: 'Engineering Lead', acc: 'Client Surface & S2S Bus', deliv: 'Manifest V3 Extension & S2S Engine', stat: 'Build • Sprint Cadence' },
        { role: 'Affiliate BD Lead', acc: 'Merchant Allowlist & SLAs', deliv: 'Top 3–5 Retailer Postback Alignment', stat: 'Negotiate • Bi-Weekly' },
        { role: 'Analytics Lead', acc: 'Causal Attribution & Power', deliv: 'Pre-registered ITT Holdout Engine', stat: 'Verify • Postback Cycle' },
      ];

      raciRows.forEach((r, idx) => {
        doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
        doc.rect(margin, y, contentWidth, 12.0, 'F');
        doc.setDrawColor(...COLORS.cardBorder);
        doc.line(margin, y + 12.0, margin + contentWidth, y + 12.0);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2);
        doc.setTextColor(...COLORS.primaryBlue);
        doc.text(r.role, margin + 3, y + 7.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.8);
        doc.setTextColor(...COLORS.textDark);
        doc.text(r.acc, margin + 46, y + 7.5);
        doc.text(r.deliv, margin + 102, y + 7.5);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.emeraldGreen);
        doc.text(r.stat, margin + 150, y + 7.5);

        y += 12.0;
      });

      y += 6;

      // Final Synthesis 3 Mandates Box (Height: 76mm)
      doc.setFillColor(...COLORS.navyDark);
      doc.roundedRect(margin, y, contentWidth, 72, 2, 2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...COLORS.white);
      doc.text('SYNTHESIS: THE THREE OPERATIONAL MANDATES', margin + 4, y + 7);

      const mandates = [
        { label: '1. BUILD NARROW:', val: 'Deliver a lightweight, consented desktop Intent Router scoped strictly to 3–5 allowlisted partner retailers upon passing G1 Discovery (≥60%).' },
        { label: '2. MEASURE CAUSALLY:', val: 'Evaluate purely via 50/50 ITT persistent holdout over 4–6 weeks. Reject vanity extension click counts.' },
        { label: '3. SCALE RESPONSIBLY:', val: 'Scale only if conservative contribution clears one-time and recurring costs (ΔO ≥ +0.08) with dispute rates <1.5%.' },
      ];

      let mandY = y + 16;
      mandates.forEach((m) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2);
        doc.setTextColor(198, 220, 253);
        doc.text(m.label, margin + 4, mandY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.8);
        doc.setTextColor(...COLORS.white);
        doc.text(doc.splitTextToSize(m.val, contentWidth - 36), margin + 34, mandY);
        mandY += 14.0;
      });

      // Sign-off line
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`Authored by: ${candidateName} • APM Candidate`, margin + 4, y + 64);
      doc.text('Final Recommendation: PROCEED WITH NARROW GATED PILOT', margin + contentWidth - 4, y + 64, { align: 'right' });
    }

    // Standard Page Footer with Page X of totalPages
    drawFooter(doc, pageWidth, pageHeight, margin, pageNumber, totalPages, dateStr);
  }

  onProgress(100, 'Complete 12-Page Strategy Dossier generated successfully! Downloading...');

  const prefix = mode === 'saved-insights' ? 'Saved_Insights_Dossier' : 'Full_12Page_Product_Strategy_Dossier';
  const filename = `Suvam_Priyaranjan_Sahoo_CashKaro_APM_${prefix}_${dateStr.replace(/[\s,]+/g, '_')}.pdf`;
  doc.save(filename);
};
