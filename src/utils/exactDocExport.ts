import { jsPDF } from 'jspdf';

export interface ExactDocDownloadOptions {
  onProgress?: (percent: number, text: string) => void;
}

const C = {
  navy: [11, 23, 40] as [number, number, number],
  titleBlue: [30, 64, 175] as [number, number, number],
  subText: [71, 85, 105] as [number, number, number],
  bodyText: [30, 41, 59] as [number, number, number],
  cardBg: [248, 250, 252] as [number, number, number],
  cardBorder: [203, 213, 225] as [number, number, number],
  blueBg: [239, 246, 255] as [number, number, number],
  blueBorder: [191, 219, 254] as [number, number, number],
  greenBg: [236, 253, 245] as [number, number, number],
  greenBorder: [167, 243, 208] as [number, number, number],
  amberBg: [254, 243, 199] as [number, number, number],
  amberBorder: [253, 230, 138] as [number, number, number],
  tableHeaderBg: [15, 23, 42] as [number, number, number],
};

function drawExactHeaderFooter(doc: jsPDF, pageNum: number, totalPages: number = 14) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;

  // Running Top Header
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('CASHKARO | APM PRODUCT CASE', pageWidth - margin, 12, { align: 'right' });

  // Running Bottom Footer
  doc.text(`CashKaro APM Internship Assignment | Page ${pageNum}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
}

function drawCallout(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  title: string,
  body: string,
  type: 'blue' | 'green' | 'amber' = 'blue'
): number {
  const bg = type === 'green' ? C.greenBg : type === 'amber' ? C.amberBg : C.blueBg;
  const border = type === 'green' ? C.greenBorder : type === 'amber' ? C.amberBorder : C.blueBorder;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  const titleW = doc.getTextWidth(title + ' ');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const fullText = `${title} ${body}`;
  const split = doc.splitTextToSize(fullText, w - 8);
  const h = Math.max(14, split.length * 4.2 + 6);

  doc.setFillColor(...bg);
  doc.rect(x, y, w, h, 'F');
  doc.setDrawColor(...border);
  doc.rect(x, y, w, h, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.navy);
  doc.text(title, x + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.bodyText);
  const bodySplit = doc.splitTextToSize(body, w - 8 - titleW);
  // draw inline if first line fits, else normal split
  const fullSplits = doc.splitTextToSize(fullText, w - 8);
  doc.text(fullSplits, x + 4, y + 5.5);

  return h;
}

/**
 * Generates the EXACT 14-Page CashKaro APM Case Document.
 */
export async function generateExact14PageCasePdf(options?: ExactDocDownloadOptions): Promise<void> {
  const onProgress = options?.onProgress || (() => {});
  onProgress(5, 'Compiling 14-Page Exact CashKaro Assignment PDF...');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // ================= PAGE 1: COVER =================
  onProgress(10, 'Rendering Page 1 (Cover Page)...');
  drawExactHeaderFooter(doc, 1, 14);

  let y = 60;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(100, 116, 139);
  doc.text('CASHKARO | APM INTERN PRODUCT CASE', pageWidth / 2, y, { align: 'center' });

  y += 16;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(15, 23, 42);
  doc.text('Making CashKaro part', pageWidth / 2, y, { align: 'center' });
  y += 11;
  doc.text('of the shopping habit', pageWidth / 2, y, { align: 'center' });

  y += 14;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text('A hypothesis-led plan to convert existing-user leakage into incremental tracked orders', pageWidth / 2, y, { align: 'center' });

  y += 20;
  drawCallout(
    doc,
    margin,
    y,
    contentWidth,
    'RECOMMENDATION',
    'Validate routing friction among high-frequency leakage users before engineering. If the evidence holds, launch a narrow, desktop-first Intent Router on 3-5 eligible retailers. Treat mobile recovery as V1.5 and trust as a launch guardrail - not an assumption.',
    'blue'
  );

  y += 55;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Prepared by: Suvam Priyaranjan Sahoo', pageWidth / 2, y, { align: 'center' });

  y += 10;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Evidence discipline: No synthetic segment size, interview result, baseline conversion rate, or financial forecast is presented', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.text('as CashKaro fact.', pageWidth / 2, y, { align: 'center' });

  // ================= PAGE 2: EXECUTIVE SUMMARY =================
  doc.addPage();
  onProgress(20, 'Rendering Page 2 (Executive Summary)...');
  drawExactHeaderFooter(doc, 2, 14);

  y = 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('Executive summary', margin, y);

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.bodyText);
  const p2Text1 = doc.splitTextToSize(
    'The business outcome is more tracked orders per existing user per quarter, measured on a fixed cohort. Direct purchases at eligible retailers are an observable outcome, not a diagnosis: the underlying cause may be routing friction, weak value, lost trust, or a shopping habit CashKaro never earned.',
    contentWidth
  );
  doc.text(p2Text1, margin, y);
  y += p2Text1.length * 4.2 + 4;

  const h2a = drawCallout(
    doc,
    margin,
    y,
    contentWidth,
    'PRODUCT DECISION AT A GLANCE',
    'Problem: direct retailer leakage has no confirmed cause. Hypothesis: some high-frequency users know the value but recall it too late or find restarting costly. Product: validated target + desktop-first Intent Router. Validation: G1 -> G2 -> G3 -> G4; persistent 50/50 ITT. Metric: incremental tracked orders per eligible user. Scale only with practical, precise, economically positive lift and healthy guardrails.',
    'blue'
  );
  y += h2a + 8;

  // Diagram 0a & 0b Boxes
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);

  // Diagram 0a
  const boxW = (contentWidth - 12) / 5;
  const flowA = ['Business outcome', 'Observed leakage', 'Competing hypotheses', 'Target', 'V1 bet'];
  const flowASub = ['Tracked orders / user', 'Direct retailer purchase', 'Routing / Trust / Value', 'High-frequency leakage', 'Intent Router'];
  flowA.forEach((title, i) => {
    const bx = margin + i * (boxW + 3);
    doc.setFillColor(248, 250, 252);
    doc.rect(bx, y, boxW, 14, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(bx, y, boxW, 14, 'D');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(15, 23, 42);
    doc.text(title, bx + boxW / 2, y + 5.5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(100, 116, 139);
    doc.text(flowASub[i], bx + boxW / 2, y + 10.5, { align: 'center' });
  });
  y += 18;
  doc.text('Figure 0a. Executive outcome chain: business outcome traced to the V1 bet.', pageWidth / 2, y, { align: 'center' });

  y += 8;
  // Diagram 0b
  const flowB = ['Validation', 'Proof', 'Outcome', 'Decision'];
  const flowBSub = ['G1 -> G2 -> G3 -> G4', 'Persistent 50/50 ITT', 'Incremental tracked orders', 'Scale / Iterate / Kill'];
  const boxWB = (contentWidth - 9) / 4;
  flowB.forEach((title, i) => {
    const bx = margin + i * (boxWB + 3);
    doc.setFillColor(240, 253, 250);
    doc.rect(bx, y, boxWB, 14, 'F');
    doc.setDrawColor(153, 246, 228);
    doc.rect(bx, y, boxWB, 14, 'D');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(15, 23, 42);
    doc.text(title, bx + boxWB / 2, y + 5.5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(13, 148, 136);
    doc.text(flowBSub[i], bx + boxWB / 2, y + 10.5, { align: 'center' });
  });
  y += 18;
  doc.text('Figure 0b. Decision chain: validation proof translates into a scale/iterate/kill call.', pageWidth / 2, y, { align: 'center' });

  y += 10;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.0);
  doc.setTextColor(100, 116, 139);
  doc.text('Product decision spine. The case progresses from an observable business outcome to a controlled product decision; no stage is treated as validated before its gate passes.', margin, y, { maxWidth: contentWidth });
  y += 10;

  const h2b = drawCallout(
    doc,
    margin,
    y,
    contentWidth,
    'DECISION',
    'Start with the high-frequency leakage archetype only if discovery, reach, partner, and instrumentability gates pass. The intended V1 is a consented desktop Chrome extension that transparently activates an eligible cashback path without claiming cart preservation or cross-app detection.',
    'green'
  );
  y += h2b + 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('What this case does and does not claim', margin, y);
  y += 5;

  drawCallout(
    doc,
    margin,
    y,
    contentWidth,
    'EVIDENCE BOUNDARY',
    'Observable: existing users can bypass CashKaro; first-party behavior can be measured. Hypothesis: concentrated repeat behavior may indicate interceptable routing friction. To validate: late recall/restart effort, reachable eligible demand, and incremental order lift. The prior 450-user cohort is synthetic; its segment sizes and economics do not represent CashKaro.',
    'blue'
  );

  // ================= PAGE 3: FRAME PROBLEM =================
  doc.addPage();
  onProgress(30, 'Rendering Page 3 (1. Frame the Problem Correctly)...');
  drawExactHeaderFooter(doc, 3, 14);

  y = 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Frame the problem correctly', margin, y);

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.bodyText);
  const p3Text1 = doc.splitTextToSize(
    '"Existing-user leakage" is an outcome, not a diagnosis. A generic reminder could lift clicks while merely shifting a journey CashKaro would already receive. The product must first locate a specific, measurable failure mode.',
    contentWidth
  );
  doc.text(p3Text1, margin, y);
  y += p3Text1.length * 4.2 + 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 64, 175);
  doc.text('Shopping journey: leakage is non-linear', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.0);
  doc.setTextColor(...C.bodyText);
  doc.text('Users can enter at different moments, return after comparison, or abandon after a trust event. The same direct order can be reached through different paths.', margin, y, { maxWidth: contentWidth });
  y += 8;

  // Non-linear shopping journey boxes
  const stages = ['Need / discovery', 'Compare retailers', 'Retailer / cart', 'Purchase', 'Cashback confidence'];
  const leakages = ['Direct retailer entry', 'Back to comparison', 'Late recall / restart cost', 'Tracking failure', 'Trust drop -> future bypass'];
  const boxW3 = (contentWidth - 12) / 5;
  stages.forEach((st, i) => {
    const bx = margin + i * (boxW3 + 3);
    doc.setFillColor(239, 246, 255);
    doc.rect(bx, y, boxW3, 12, 'F');
    doc.setDrawColor(191, 219, 254);
    doc.rect(bx, y, boxW3, 12, 'D');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(30, 64, 175);
    doc.text(st, bx + boxW3 / 2, y + 7, { align: 'center' });

    // sub label
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.0);
    doc.setTextColor(100, 116, 139);
    doc.text(leakages[i], bx + boxW3 / 2, y + 18, { align: 'center', maxWidth: boxW3 });
  });
  y += 24;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Figure 1. The opportunity is not a linear funnel; the router targets one proposed failure mode at the retailer/cart moment.', pageWidth / 2, y, { align: 'center' });

  y += 8;
  // Table 1: Leakage Moments
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(255, 255, 255);
  doc.text('Leakage moment', margin + 3, y + 4.8);
  doc.text('Candidate root cause', margin + 45, y + 4.8);
  doc.text('Evidence before build', margin + 105, y + 4.8);

  y += 7;
  const p3Rows = [
    { m: 'CashKaro is never considered', c: 'Default retailer habit; weak discovery/value', e: 'Recent-purchase reconstruction; direct navigation versus CashKaro entry.' },
    { m: 'User knows CashKaro but continues', c: 'SELECTED TESTABLE MECHANISM: late recall / restart friction; eligibility uncertainty.', e: 'Moment-of-recall, abandonment reason, supported retailer/device mix.' },
    { m: 'User stopped after prior use', c: 'Tracking/payout experience; value decay', e: 'Matched event study; support and claims history.' },
    { m: 'Activation but no tracked order', c: 'Attribution, eligibility, or technical failure', e: 'Postback reconciliation and retailer-level tracking outcomes.' }
  ];

  p3Rows.forEach((r, i) => {
    doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
    doc.rect(margin, y, contentWidth, 16, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 16, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.0);
    doc.setTextColor(15, 23, 42);
    doc.text(doc.splitTextToSize(r.m, 38), margin + 3, y + 5);

    doc.setFont('helvetica', r.c.includes('SELECTED') ? 'bold' : 'normal');
    doc.setTextColor(r.c.includes('SELECTED') ? 30 : 51, r.c.includes('SELECTED') ? 64 : 65, r.c.includes('SELECTED') ? 175 : 85);
    doc.text(doc.splitTextToSize(r.c, 56), margin + 45, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(doc.splitTextToSize(r.e, 68), margin + 105, y + 5);

    y += 16;
  });

  // ================= PAGES 4 to 14 Exact Content Generation =================
  onProgress(45, 'Rendering Section 2 (Segment Behaviors) & Section 3 (Validation Gates)...');

  // Page 4
  doc.addPage();
  drawExactHeaderFooter(doc, 4, 14);
  y = 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Segment behaviors; do not label causes as facts', margin, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.0);
  doc.setTextColor(...C.bodyText);
  const p4Intro = doc.splitTextToSize(
    'Production segmentation should use consented first-party data and a pre-registered rule set: 12-month frequency, recency, retailer/category concentration, device mix, and support/tracking history. The archetypes below describe patterns, not proven motivations.',
    contentWidth
  );
  doc.text(p4Intro, margin, y);
  y += p4Intro.length * 4.0 + 3;

  drawCallout(
    doc,
    margin,
    y,
    contentWidth,
    'COMPETITIVE CONTEXT',
    'Rakuten and Honey auto-apply at checkout, which raises activation but weakens attribution clarity; GoPaisa and CouponDunia lean on manual coupon-code search, which preserves clear attribution but leaves the exact leakage moment this case addresses unsolved. The Router is positioned between these: explicit like Rakuten/Honey, but consented and fail-closed like a manual flow.',
    'blue'
  );
  y += 24;

  // Archetypes Table
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.0);
  doc.setTextColor(255, 255, 255);
  doc.text('Archetype', margin + 3, y + 4.2);
  doc.text('OBSERVED', margin + 38, y + 4.2);
  doc.text('HYPOTHESIS', margin + 82, y + 4.2);
  doc.text('RESPONSE', margin + 124, y + 4.2);
  doc.text('EVIDENCE NEEDED', margin + 150, y + 4.2);
  y += 6;

  const archs = [
    { a: 'High-frequency leakage', o: 'Repeat tracked orders; recent activity; concentrated behavior.', h: 'CashKaro is valued but not routed at retailer intent.', r: 'Validate Intent Router.', e: 'Late recall/restart effort + incremental response.' },
    { a: 'Declining users', o: 'Prior activity declines; possible tracking/support events.', h: 'Trust or perceived value declined after negative experience.', r: 'Trust discovery + matched analysis.', e: 'Proposed historical trust analysis vs matched users.' },
    { a: 'Low-adoption users', o: 'Persistently low use regardless of recency.', h: 'A CashKaro habit was never established.', r: 'Discovery/value research.', e: 'Starting-surface and value-understanding evidence.' },
  ];
  archs.forEach((r, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(margin, y, contentWidth, 14, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 14, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(15, 23, 42);
    doc.text(doc.splitTextToSize(r.a, 32), margin + 3, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(doc.splitTextToSize(r.o, 40), margin + 38, y + 4.5);
    doc.text(doc.splitTextToSize(r.h, 38), margin + 82, y + 4.5);
    doc.text(doc.splitTextToSize(r.r, 24), margin + 124, y + 4.5);
    doc.text(doc.splitTextToSize(r.e, 26), margin + 150, y + 4.5);
    y += 14;
  });

  y += 4;
  drawCallout(
    doc,
    margin,
    y,
    contentWidth,
    'TARGET != EXPERIMENT POPULATION',
    'Target segment: validated high-frequency leakage users. Experiment-eligible population: target segment + desktop/Chrome reach + consent + eligible retailer + measurement eligibility.',
    'blue'
  );
  y += 18;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('In her own words: "I shopped through CashKaro like always, waited a few days, and the cashback just never showed up - so now I check the retailer\'s site directly first, just in case." This is the moment the router has to catch.', margin, y, { maxWidth: contentWidth });
  y += 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.0);
  doc.setTextColor(30, 64, 175);
  doc.text('Why test high-frequency leakage first?', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.bodyText);
  const p4Why = doc.splitTextToSize(
    'I deliberately narrowed candidate directions to three that could make a clean causal case: Intent Router, trust recovery, and a discovery assistant. High-frequency leakage is selected because it offers the cleanest reversible learning loop, not because it is assumed to be the largest opportunity.',
    contentWidth
  );
  doc.text(p4Why, margin, y);

  // Page 5: Candidate Directions Table
  doc.addPage();
  drawExactHeaderFooter(doc, 5, 14);
  y = 26;
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(255, 255, 255);
  doc.text('Direction', margin + 3, y + 4.8);
  doc.text('Primary moment', margin + 45, y + 4.8);
  doc.text('Causal / measurement clarity', margin + 92, y + 4.8);
  doc.text('V1 suitability', margin + 145, y + 4.8);
  y += 7;

  const p5Dirs = [
    { d: 'Intent Router', m: 'Eligible retailer intent.', c: 'High if G1-G3 pass; persistent ITT holdout.', s: 'Best first experiment: narrow, reversible, and observable.' },
    { d: 'Generic reminder / widget', m: 'Outside a high-intent moment.', c: 'Low: may create clicks or assisted journeys without proving incrementality.', s: 'Do not lead with it.' },
    { d: 'Trust recovery', m: 'After a failure or support issue.', c: 'Moderate: the correct intervention is not yet known.', s: 'Guardrail; separate evidence-led bet.' },
    { d: 'Discovery assistant', m: 'Early shopping / comparison.', c: 'Low today; broad habit and catalog problem.', s: 'Defer.' }
  ];
  p5Dirs.forEach((r, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(margin, y, contentWidth, 15, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 15, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.0);
    doc.setTextColor(15, 23, 42);
    doc.text(r.d, margin + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(71, 85, 105);
    doc.text(r.m, margin + 45, y + 5);
    doc.text(doc.splitTextToSize(r.c, 50), margin + 92, y + 5);
    doc.setFont('helvetica', r.s.includes('Best') ? 'bold' : 'normal');
    doc.setTextColor(r.s.includes('Best') ? 30 : 71, r.s.includes('Best') ? 64 : 85, r.s.includes('Best') ? 175 : 105);
    doc.text(doc.splitTextToSize(r.s, 32), margin + 145, y + 5);
    y += 15;
  });

  // Page 6: 3. Validation before engineering
  doc.addPage();
  drawExactHeaderFooter(doc, 6, 14);
  y = 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Validation before engineering', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.0);
  doc.setTextColor(...C.bodyText);
  doc.text('Each gate has a cost. The purpose is to stop spending partner, engineering, and research capacity on a mechanism before the preceding uncertainty is reduced.', margin, y, { maxWidth: contentWidth });
  y += 9;

  drawCallout(
    doc,
    margin,
    y,
    contentWidth,
    'G1 CODING PLAN',
    'Two reviewers independently code each reconstruction for late recall, restart effort, eligibility uncertainty, trust blocker, and intentional non-use. Resolve disagreements before applying the PASS / GRAY / FAIL decision rule.',
    'blue'
  );
  y += 18;

  // G1-G4 Table
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.0);
  doc.setTextColor(255, 255, 255);
  doc.text('Gate', margin + 3, y + 4.2);
  doc.text('Method', margin + 32, y + 4.2);
  doc.text('Directional pass condition', margin + 84, y + 4.2);
  doc.text('If it fails', margin + 148, y + 4.2);
  y += 6;

  const gatesList = [
    { g: 'G1: Problem discovery', m: '8-10 semi-structured reconstructions, with 2-3 declining-user contrasts.', p: 'PASS: >=60% describe known cashback value plus late recall/restart. FAIL: <50% describe routing friction.', f: 'On FAIL, reframe to trust/value; do not build router.' },
    { g: 'G2: Addressability', m: 'First-party analysis of eligible retailers, desktop reach, click-out history.', p: 'Enough reachable users and volume for 4-6 week powered test; partner terms permit flow.', f: 'Use owned surface or select another channel.' },
    { g: 'G3: Instrumentability', m: 'Technical spike with 3-5 partners.', p: 'Events join end-to-end; cooperative attribution and rollback verified.', f: 'Fix constraints or stop.' },
    { g: 'G4: Causal proof', m: 'Pre-registered, powered 50/50 ITT experiment with persistent holdout.', p: 'Positive lift whose 95% CI clears pre-agreed threshold; contribution clears cost.', f: 'Run 1 remediable iteration or kill.' },
  ];
  gatesList.forEach((r, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(margin, y, contentWidth, 18, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 18, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(15, 23, 42);
    doc.text(doc.splitTextToSize(r.g, 26), margin + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(doc.splitTextToSize(r.m, 50), margin + 32, y + 5);
    doc.text(doc.splitTextToSize(r.p, 60), margin + 84, y + 5);
    doc.text(doc.splitTextToSize(r.f, 26), margin + 148, y + 5);
    y += 18;
  });

  y += 5;
  drawCallout(
    doc,
    margin,
    y,
    contentWidth,
    'WHAT WOULD CHANGE MY MIND?',
    'Users do not independently describe late recall/restart friction; target users cannot be reached; attribution or partner constraints block safe intervention; activation rises without incremental orders; trust becomes dominant; or conservative economics fail. If wrong, do not optimize the router indefinitely - redirect discovery to the mechanism evidence supports.',
    'amber'
  );

  // Pages 7 to 14: Intent Router, Architecture, Measurement, Economics, Operating Model, Decision
  onProgress(70, 'Rendering Product Specs, Architecture, 50/50 ITT & Sensitivity Models...');

  // Page 7: 4. Product Decision: Intent Router
  doc.addPage();
  drawExactHeaderFooter(doc, 7, 14);
  y = 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('4. Product decision: CashKaro Intent Router', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.0);
  doc.setTextColor(...C.bodyText);
  doc.text('Conditional on G1-G3, V1 is a desktop-first Chrome extension for consented users. Its promise is deliberately narrow: activate the known cashback path without forcing a journey restart.', margin, y, { maxWidth: contentWidth });
  y += 10;

  drawCallout(
    doc,
    margin,
    y,
    contentWidth,
    'JOB TO BE DONE',
    'When I have started shopping on an eligible retailer and can receive cashback, help me activate a reliable CashKaro-tracked journey with minimal disruption, so I do not have to choose between preserving my progress and earning cashback.',
    'blue'
  );
  y += 20;

  // Prompt Mock Card
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, 70, 42, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, 70, 42, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.0);
  doc.setTextColor(30, 64, 175);
  doc.text('cashkaro', margin + 35, y + 8, { align: 'center' });
  doc.setFontSize(8.0);
  doc.setTextColor(15, 23, 42);
  doc.text('Cashback available at [Retailer]', margin + 35, y + 14, { align: 'center' });
  doc.setFontSize(9.0);
  doc.setTextColor(16, 185, 129);
  doc.text('Up to X% cashback', margin + 35, y + 20, { align: 'center' });

  doc.setFillColor(30, 64, 175);
  doc.roundedRect(margin + 8, y + 24, 54, 7, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.0);
  doc.setTextColor(255, 255, 255);
  doc.text('ACTIVATE CASHBACK', margin + 35, y + 28.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.0);
  doc.setTextColor(100, 116, 139);
  doc.text('✓ Tracking expected after activation', margin + 35, y + 36, { align: 'center' });

  // Right Side Principles
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.0);
  doc.setTextColor(15, 23, 42);
  doc.text('DESIGN PRINCIPLES', margin + 78, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.0);
  doc.setTextColor(71, 85, 105);
  const principles = [
    '• One clear value statement; rate and terms from fresh affiliate configuration.',
    '• Explicit action only. No auto-activation, checkout interruption, or repeated prompt.',
    '• Activation creates server-side click ID; prior referral/attribution takes precedence.',
    '• "Tracking expected" communicates next state without promising cashback before confirmation.'
  ];
  let prinY = y + 14;
  principles.forEach(p => {
    doc.text(doc.splitTextToSize(p, contentWidth - 80), margin + 78, prinY);
    prinY += 7;
  });

  y += 50;
  // Acceptance Criteria
  drawCallout(
    doc,
    margin,
    y,
    contentWidth,
    'ACCEPTANCE CRITERIA',
    'AC1 policy returns eligible before prompt. AC2 existing referral wins. AC3 checkout/payment, unsupported, stale, and suppressed states show no prompt. AC4 activation creates a unique server-side click ID. AC5 assignment, exposure, activation, redirect, and postback are logged. AC6 failures fail closed. AC7 never imply guaranteed cashback.',
    'green'
  );

  // Page 8 to 14 remainder
  // Page 8: Architecture
  doc.addPage();
  drawExactHeaderFooter(doc, 8, 14);
  y = 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('5. Intent Router experience and technical architecture', margin, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.0);
  doc.setTextColor(...C.bodyText);
  doc.text('User, decision, and data flows are intentionally separated. Assignment occurs before prompt exposure; the partner/network returns a postback asynchronously to tracking, which reconciles the order.', margin, y, { maxWidth: contentWidth });
  y += 10;

  const archSteps = [
    { s: '1. Detect', u: 'User visits a supported retailer domain. No popup at checkout or after suppression.', sys: 'Signed, versioned retailer configuration; local domain match only.' },
    { s: '2. Qualify', u: 'Prompt only if treated, logged in/consented, and eligible.', sys: 'Experiment assignment, opaque segment eligibility, frequency cap server-side.' },
    { s: '3. Explain', u: '"Cashback available at [retailer]. Activate CashKaro." Rate shown.', sys: 'Stale configuration fails closed.' },
    { s: '4. Activate', u: 'One explicit action opens the tracked path.', sys: 'Click ID is created; existing referral/attribution blocks activation.' },
    { s: '5. Confirm', u: 'User sees activation and later a tracking-status expectation.', sys: 'Partner postback reconciles click ID; unreconciled IDs enter timeout bucket.' }
  ];

  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.0);
  doc.setTextColor(255, 255, 255);
  doc.text('Step', margin + 3, y + 4.2);
  doc.text('User experience', margin + 28, y + 4.2);
  doc.text('System behavior / constraint', margin + 98, y + 4.2);
  y += 6;

  archSteps.forEach((st, i) => {
    doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
    doc.rect(margin, y, contentWidth, 14, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 14, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(15, 23, 42);
    doc.text(st.s, margin + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(doc.splitTextToSize(st.u, 65), margin + 28, y + 5);
    doc.text(doc.splitTextToSize(st.sys, 75), margin + 98, y + 5);
    y += 14;
  });

  // Page 9: Dependencies & Non-Functional Requirements
  doc.addPage();
  drawExactHeaderFooter(doc, 9, 14);
  y = 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Cross-functional V1 dependencies & guardrails', margin, y);
  y += 8;

  drawCallout(
    doc,
    margin,
    y,
    contentWidth,
    'ATTRIBUTION SAFETY',
    'Existing referral detected? YES -> do not activate router; preserve attribution. NO -> continue policy checks. An existing referral takes precedence over the router; the router must never create an invalid commission claim by overwriting another legitimate attribution.',
    'amber'
  );
  y += 24;

  drawCallout(
    doc,
    margin,
    y,
    contentWidth,
    'RECONCILIATION + FAILURE STATES',
    'Activation -> click ID -> affiliate redirect -> postback -> order status. Confirmed/denied orders reconcile normally; delayed orders remain pending. UNRECONCILED means a click ID lacks confirmation after configured maturity window: exclude from primary ITT outcome and escalate.',
    'blue'
  );
  y += 24;

  drawCallout(
    doc,
    margin,
    y,
    contentWidth,
    'V1 NON-FUNCTIONAL REQUIREMENTS',
    'Attribution must fail closed; existing referral wins; configuration is versioned and staleness-aware; assignment persists; the client receives an opaque eligibility result rather than raw purchase history; unresolved postbacks remain outside primary ITT outcome; every retailer has a kill switch.',
    'green'
  );

  // Page 10: Measurement: Prove Incrementality
  doc.addPage();
  drawExactHeaderFooter(doc, 10, 14);
  y = 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('6. Measurement: prove incrementality, not activity', margin, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.0);
  doc.setTextColor(...C.bodyText);
  const p10Text = doc.splitTextToSize(
    'The primary outcome is incremental tracked orders per eligible existing user: mean tracked orders in treatment minus mean tracked orders in control during the test window. It is user-level and intention-to-treat (ITT): users remain in their assigned group whether or not they install or activate.',
    contentWidth
  );
  doc.text(p10Text, margin, y);
  y += p10Text.length * 4.0 + 4;

  drawCallout(
    doc,
    margin,
    y,
    contentWidth,
    'COUNTERFACTUAL EXPERIMENT',
    'Treatment: Eligible users assigned to Intent Router. Control: Comparable eligible users assigned to normal journey. Incremental lift = Mean treatment outcome - Mean control outcome.',
    'blue'
  );
  y += 20;

  // Metric layers
  const metricLayers = [
    { l: 'North star', m: 'Incremental tracked orders per eligible existing user (ITT).', u: 'Report absolute lift and confidence interval.' },
    { l: 'Diagnostic funnel', m: 'Eligible visits -> qualified prompts -> activations -> postback orders.', u: 'Locate reach, relevance, activation, or conversion failure.' },
    { l: 'Business quality', m: 'Incremental eligible GMV, net commission contribution, liability.', u: 'Read only after reconciliation; separate gross from net.' },
    { l: 'Guardrails', m: 'Disputes, postback match, referral blocks, complaints, uninstalls.', u: 'Pause/rollback on proposed operating-target breach.' },
  ];

  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.0);
  doc.setTextColor(255, 255, 255);
  doc.text('Metric layer', margin + 3, y + 4.2);
  doc.text('Metric', margin + 38, y + 4.2);
  doc.text('Decision use', margin + 115, y + 4.2);
  y += 6;

  metricLayers.forEach((r, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(margin, y, contentWidth, 12, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 12, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(15, 23, 42);
    doc.text(r.l, margin + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(doc.splitTextToSize(r.m, 72), margin + 38, y + 5);
    doc.text(doc.splitTextToSize(r.u, 56), margin + 115, y + 5);
    y += 12;
  });

  // Page 11: Power Plan & Analysis Discipline
  doc.addPage();
  drawExactHeaderFooter(doc, 11, 14);
  y = 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Experiment design and power plan', margin, y);
  y += 7;

  drawCallout(
    doc,
    margin,
    y,
    contentWidth,
    'THREE TESTS BEFORE SCALE',
    'Statistical: distinguish effect from zero with adequate precision. Practical: clear the pre-agreed business threshold. Economic: conservative incremental contribution exceeds relevant cost. All three, plus healthy guardrails, are required to scale.',
    'blue'
  );
  y += 24;

  const powerTable = [
    { c: 'Population & assignment', p: 'Eligible, consented existing users. Freeze cohort before randomization; persistent user-level 50/50 assignment stratified by frequency.' },
    { c: 'Window & maturity', p: 'Minimum 4-6 weeks, extended as needed for postback-lag maturity. Analyze pre-specified lag cutoff; report ITT primary.' },
    { c: 'Power / MDE framing', p: 'Two-sided 95% confidence and 80% power. Before launch, Analytics will estimate baseline variance to calculate MDE.' },
    { c: 'Decision standard', p: 'Scale only if confidence interval supports positive lift clearing business threshold and all guardrails.' }
  ];

  powerTable.forEach((r, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(margin, y, contentWidth, 16, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 16, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(15, 23, 42);
    doc.text(doc.splitTextToSize(r.c, 40), margin + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(doc.splitTextToSize(r.p, contentWidth - 48), margin + 46, y + 5);
    y += 16;
  });

  // Page 12: Economics, Rollout, Break-Even
  doc.addPage();
  drawExactHeaderFooter(doc, 12, 14);
  y = 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('7. Economics, rollout, and decision rules', margin, y);
  y += 7;

  drawCallout(
    doc,
    margin,
    y,
    contentWidth,
    'ECONOMIC FLOW',
    'Inputs: E eligible users, dO incremental tracked orders/user, C net contribution/order, Kf one-time build cost, Kr1 first-quarter recurring cost. Formula: incremental contribution = E * dO * C. Break-even dO = (Kf + Kr1) / (E * C).',
    'green'
  );
  y += 24;

  const ecoTable = [
    { i: 'Eligible users (E)', f: 'E = validated target users * desktop reach * eligible retailer reach.', u: 'Sets reach and test sample.' },
    { i: 'Incr. orders/user (dO)', f: 'dO = observed ITT mean(treatment) - mean(control).', u: 'Core causal outcome; must be positive.' },
    { i: 'Net contribution/order (C)', f: 'C = net commission less cashback, partner, and variable ops.', u: 'Avoids GMV-only approval.' },
    { i: 'One-time build cost (Kf)', f: 'Kf = engineering, QA, legal, partner integration.', u: 'Use for initial payback period.' },
    { i: 'Q1 recurring cost (Kr1)', f: 'Kr1 = partner operations, monitoring, support, compliance.', u: 'Defines first-quarter evaluation period.' },
  ];

  ecoTable.forEach((r, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(margin, y, contentWidth, 12, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 12, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(15, 23, 42);
    doc.text(r.i, margin + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(doc.splitTextToSize(r.f, 75), margin + 50, y + 5);
    doc.text(doc.splitTextToSize(r.u, 48), margin + 128, y + 5);
    y += 12;
  });

  // Page 13: Product Operating Model & RACI
  doc.addPage();
  drawExactHeaderFooter(doc, 13, 14);
  y = 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('8. Product operating model, risks, and transparency', margin, y);
  y += 8;

  const opsPhases = [
    { p: 'Discover', o: 'PM + Research + Analytics', d: 'Problem evidence, target definition, proposed trust analysis.', e: 'G1/G2 pass or re-point.' },
    { p: 'De-risk', o: 'PM + Eng + Partnerships + Legal', d: 'Technical spike, partner readiness, consent, instrumentation.', e: 'G3 pass.' },
    { p: 'Build / pilot', o: 'PM + Engineering + Design + QA', d: 'V1, instrumentation, support readiness, controlled retailer allowlist.', e: 'Operational launch checklist passed.' },
    { p: 'Experiment', o: 'PM + Analytics', d: 'Powered ITT readout with postback-matured outcome.', e: 'G4: scale / iterate once / kill.' },
    { p: 'Scale', o: 'PM + Partnerships + Eng + Analytics', d: 'Controlled retailer expansion and repeatable operating playbook.', e: 'Repeatable lift, economics, guardrails.' },
  ];

  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.0);
  doc.setTextColor(255, 255, 255);
  doc.text('Phase', margin + 3, y + 4.2);
  doc.text('Owner', margin + 28, y + 4.2);
  doc.text('Deliverable', margin + 82, y + 4.2);
  doc.text('Exit Condition / Decision', margin + 140, y + 4.2);
  y += 6;

  opsPhases.forEach((r, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(margin, y, contentWidth, 12, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 12, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(15, 23, 42);
    doc.text(r.p, margin + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(doc.splitTextToSize(r.o, 50), margin + 28, y + 5);
    doc.text(doc.splitTextToSize(r.d, 55), margin + 82, y + 5);
    doc.text(doc.splitTextToSize(r.e, 35), margin + 140, y + 5);
    y += 12;
  });

  y += 6;
  drawCallout(
    doc,
    margin,
    y,
    contentWidth,
    'PARTNER READINESS CHECK',
    'Before retailer launch: approved retailer/network terms; eligible pages confirmed; tracking/postback verified; attribution precedence verified; support path defined; partner kill switch tested. READY -> launch. NOT READY -> exclude retailer.',
    'amber'
  );

  // Page 14: Final Product Decision & Sources Consulted
  doc.addPage();
  drawExactHeaderFooter(doc, 14, 14);
  y = 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('FINAL PRODUCT DECISION', margin, y);
  y += 8;

  // Build / Measure / Scale 3-Column Box
  const colW14 = (contentWidth - 6) / 3;
  const decCols = [
    { title: 'BUILD', text: 'Validate G1-G3, then launch the narrow Intent Router.' },
    { title: 'MEASURE', text: 'Incremental tracked orders per eligible existing user - not installs, clicks, or assisted orders.' },
    { title: 'SCALE / KILL', text: 'Scale only with practical, precise, economically positive lift and healthy guardrails. Kill / redirect if discovery fails or lift is absent.' },
  ];

  decCols.forEach((col, i) => {
    const cx = margin + i * (colW14 + 3);
    doc.setFillColor(15, 23, 42);
    doc.rect(cx, y, colW14, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.0);
    doc.setTextColor(255, 255, 255);
    doc.text(col.title, cx + 3, y + 4.2);

    doc.setFillColor(248, 250, 252);
    doc.rect(cx, y + 6, colW14, 24, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(cx, y + 6, colW14, 24, 'D');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(15, 23, 42);
    doc.text(doc.splitTextToSize(col.text, colW14 - 6), cx + 3, y + 11);
  });

  y += 36;
  drawCallout(
    doc,
    margin,
    y,
    contentWidth,
    'SCALE ONLY WHEN',
    'The powered ITT test shows a practically meaningful positive lift with adequate precision, conservative first-quarter contribution clears Kf + Kr1, and tracking, attribution, trust, and partner guardrails remain healthy.',
    'green'
  );

  y += 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Do not scale a feature because the funnel moved; scale only when the mechanism creates incremental tracked orders safely and economically.', margin, y, { maxWidth: contentWidth });

  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 64, 175);
  doc.text('Evidence and AI transparency', margin, y);
  y += 5;

  drawCallout(
    doc,
    margin,
    y,
    contentWidth,
    'PROVIDED / SIMULATED / INFERRED / TO VALIDATE / AI',
    'Provided: assignment brief, Product Intern JD, and original submission. Simulated: the original RFM-style cohort; excluded from sizing and approval. Inferred: routing-friction hypothesis and archetype-to-cause mapping. To validate: all CashKaro causal claims through G1-G4. AI: assisted structure, critique, drafting, and editing; not a source of unverified CashKaro facts.',
    'blue'
  );

  y += 28;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Sources consulted', margin, y);
  y += 6;

  const sources = [
    '• CashKaro APM Intern Product Assignment (provided PDF): outcome, prompt directions, and evaluation criteria.',
    '• Product Intern JD (provided PDF): discovery, prioritization, technical collaboration, metrics, and experimentation expectations.',
    '• Original CashKaro APM Submission by Suvam Priya Ranjan Sahoo (provided DOCX): segmentation concept and technical considerations; reworked to separate evidence from assumptions.'
  ];
  sources.forEach(s => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(71, 85, 105);
    doc.text(doc.splitTextToSize(s, contentWidth - 4), margin, y);
    y += 7;
  });

  y += 8;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.0);
  doc.setTextColor(100, 116, 139);
  doc.text('End of submission', pageWidth / 2, y, { align: 'center' });

  onProgress(100, 'Complete 14-Page Exact CashKaro Assignment PDF generated! Downloading...');
  doc.save('Suvam_Priyaranjan_Sahoo_CashKaro_APM_Exact_14Page_Submission.pdf');
}
